/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Roster Publishing, Personalized Email Generator & Dispatch Engine (Phase 13)
 */

import type { HoursHistory } from '../hours/hoursBalance';

import { summarizeNurseHours } from '../reports/hoursAccounting';
import {
  Schedule,
  ScheduleVersion,
  Assignment,
  Nurse,
  DutyWindow,
  Doctor,
  ClinicalRole,
  Specialty,
  LeaveEntry,
  LeaveType,
  PublishLog,
  EmailRecipientLog,
  Acknowledgment,
  ShareLink,
  WorkingHoursPeriod,
} from '../../types';
import { EmailSettingsConfig, DEFAULT_EMAIL_SETTINGS } from '../../types/settings';
import { AssignmentDiffItem } from '../history/diffEngine';
import { getRepository } from '../repository';
import { authService } from '../auth/authService';
import { canEditClinicData } from '../auth/access';
import { readEmailResponse } from '../email/emailResponse';
import { escapeHtml, safeColor } from '../../utils/escapeHtml';
import { leaveCreditInRange, resolveFullTimeTarget } from '../hours/hoursPolicy';

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
import { isFloatShift } from '../engine/floatShift';

export interface GenerateEmailPayloadParams {
  clinicName: string;
  schedule: Schedule;
  version: ScheduleVersion;
  nurse: Nurse;
  assignments: Assignment[];
  dutyWindows: DutyWindow[];
  doctors: Doctor[];
  roles: ClinicalRole[];
  specialties: Specialty[];
  leaveEntries: LeaveEntry[];
  leaveTypes: LeaveType[];
  changes?: AssignmentDiffItem[];
  generalNote?: string;
  shareToken?: string;
  /** The nurse's private page with personal and team schedules, when available. */
  privateRosterUrl?: string;
  ackToken: string;
  isChangeAlert?: boolean;
  workingHoursPeriods?: WorkingHoursPeriod[];
  hoursHistory?: HoursHistory;
}

export interface DispatchResult {
  recipientLog: EmailRecipientLog;
  acknowledgment: Acknowledgment;
}

export class RosterPublishService {
  /**
   * Generates a beautiful, responsive, Gmail-compatible HTML email body for a nurse
   */
  public static generatePersonalEmailHtml(params: GenerateEmailPayloadParams): {
    subject: string;
    bodyPreview: string;
    html: string;
  } {
    const {
      clinicName,
      schedule,
      version,
      nurse,
      assignments,
      dutyWindows,
      doctors,
      roles,
      specialties,
      leaveEntries,
      leaveTypes,
      changes,
      generalNote,
      shareToken,
      privateRosterUrl,
      ackToken,
      isChangeAlert,
      workingHoursPeriods = [],
    } = params;

    const dutyMap = new Map(dutyWindows.map((d) => [d.id, d]));
    const docMap = new Map(doctors.map((d) => [d.id, d]));
    const roleMap = new Map(roles.map((r) => [r.id, r]));
    const spMap = new Map(specialties.map((s) => [s.id, s]));
    const ltMap = new Map(leaveTypes.map((l) => [l.id, l]));

    const nurseAsgns = assignments
      .filter((a) => a.nurseId === nurse.id)
      .sort((a, b) => a.date.localeCompare(b.date));

    const nurseLeaves = leaveEntries
      .filter((le) => le.nurseId === nurse.id && le.approved)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));

    // Hours by the shared rule (a leave day counts its leave, not also a shift)
    const hours = summarizeNurseHours(nurse, schedule, assignments, dutyMap, leaveEntries, ltMap, workingHoursPeriods, undefined, params.hoursHistory);
    const dutyHours = hours.dutyHours;
    const leaveCreditedHours = hours.leaveHours;
    const targetHours = hours.targetHours;
    const totalEarnedHours = hours.totalHours;
    const variance = hours.closingBalanceHours;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://clinicroster.app';
    // No link unless the planner chose to include one (never a made up token).
    const viewUrl = shareToken
      ? `${origin}/#published?token=${encodeURIComponent(shareToken)}&nurse=${encodeURIComponent(nurse.id)}`
      : '';
    const ackUrl = `${origin}/#ack?token=${encodeURIComponent(ackToken)}`;

    // Every user supplied value below is HTML escaped.
    const h = escapeHtml;

    const subject = isChangeAlert
      ? `Schedule updated — ${clinicName} (${schedule.name} v${version.number})`
      : `Your roster — ${clinicName} — ${schedule.name}`;

    const bodyPreview = isChangeAlert
      ? `Update notice: ${changes?.length || 0} change(s) applied to your schedule for ${schedule.name}.`
      : `Official duty roster for ${schedule.startDate} to ${schedule.endDate}. Total: ${totalEarnedHours}h.`;

    // Construct roster rows HTML
    const rowsHtml = nurseAsgns
      .map((a) => {
        const dw = dutyMap.get(a.dutyWindowId);
        const dObj = new Date(a.date);
        const weekday = WEEKDAY_NAMES[dObj.getUTCDay()];

        let target = 'General Pool';
        if (isFloatShift(a)) target = 'Float';
        else if (a.doctorId) target = docMap.get(a.doctorId)?.fullName || 'Doctor';
        else if (a.clinicalRoleId) target = roleMap.get(a.clinicalRoleId)?.name || 'Clinical Role';
        else if (a.specialtyId) target = spMap.get(a.specialtyId)?.name || 'Specialty';
        target = h(target);

        return `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 12px; font-family: monospace; font-size: 13px; color: #1e293b;">${h(a.date)} (${weekday})</td>
            <td style="padding: 8px 12px;">
              <span style="display: inline-block; background-color: ${safeColor(dw?.color, '#4f46e5')}; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px; font-family: monospace;">
                ${h(dw?.acronym || 'D')}
              </span>
              <span style="font-size: 12px; color: #334155; margin-left: 6px;">${h(dw?.startTime)}–${h(dw?.endTime)}</span>
            </td>
            <td style="padding: 8px 12px; font-size: 13px; color: #0f172a; font-weight: 500;">${target}</td>
          </tr>
        `;
      })
      .join('');

    // Construct change alert diff list
    let changesSectionHtml = '';
    if (isChangeAlert && changes && changes.length > 0) {
      const changeItemsHtml = changes
        .map(
          (c) => `
          <li style="margin-bottom: 6px; font-size: 13px; color: #991b1b;">
            <strong>${h(c.date)} (${h(c.weekday)}):</strong> ${h(c.description)}
          </li>`
        )
        .join('');

      changesSectionHtml = `
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #991b1b; text-transform: uppercase; letter-spacing: 0.5px;">
            ⚠️ Changes Specifically Affecting Your Schedule:
          </h4>
          <ul style="margin: 0; padding-left: 18px;">
            ${changeItemsHtml}
          </ul>
        </div>
      `;
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${h(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0" border="0">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1e1b4b; padding: 24px 30px; border-bottom: 3px solid #6366f1;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">${h(clinicName)}</h1>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #c7d2fe;">Nursing Operations Department · Outpatient Services</p>
                  </td>
                  <td align="right">
                    <span style="background-color: #4338ca; color: #e0e7ff; font-family: monospace; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px;">
                      v${version.number} ${version.isPublished ? 'OFFICIAL' : 'DRAFT'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 24px 30px;">
              <h2 style="margin: 0 0 12px 0; font-size: 16px; color: #0f172a;">Dear ${h(nurse.fullName)},</h2>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                ${
                  isChangeAlert
                    ? `An updated revision of the nursing duty schedule (<strong>${h(schedule.name)}</strong>) has been published. Please review your personalized shift breakdown below.`
                    : `Your official nursing duty schedule for <strong>${h(schedule.name)}</strong> (${h(schedule.startDate)} to ${h(schedule.endDate)}) has been finalized and published.`
                }
              </p>

              ${
                generalNote
                  ? `<div style="background-color: #f1f5f9; border-left: 4px solid #6366f1; padding: 10px 14px; margin-bottom: 20px; font-size: 13px; color: #334155; font-style: italic;">
                      "${h(generalNote)}"
                    </div>`
                  : ''
              }

              ${changesSectionHtml}

              <!-- Hours Summary Stat Cards -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; width: 25%;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Adjusted Goal</div>
                    <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 2px;">${targetHours}h</div>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; width: 25%;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Duties Worked</div>
                    <div style="font-size: 18px; font-weight: 700; color: #4338ca; margin-top: 2px;">${dutyHours}h</div>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; width: 25%;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Leave Credited</div>
                    <div style="font-size: 18px; font-weight: 700; color: #d97706; margin-top: 2px;">${leaveCreditedHours}h</div>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; width: 25%;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Closing Balance</div>
                    <div style="font-size: 18px; font-weight: 700; color: ${variance >= 0 ? '#15803d' : '#b91c1c'}; margin-top: 2px;">
                      ${variance >= 0 ? `+${variance}h` : `${variance}h`}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #64748b;">Base goal: ${hours.balance.baseTargetHours}h. Carried from earlier rosters: ${Math.round(Math.abs(hours.balance.carriedHours) * 10) / 10}h ${hours.balance.carriedHours >= 0 ? 'owed' : 'ahead'}.</p>
              <!-- Shift Timetable -->
              <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                Your Assigned Clinical Shifts (${nurseAsgns.length} Days)
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; margin-bottom: 24px; text-align: left;">
                <thead>
                  <tr style="background-color: #f1f5f9; border-bottom: 1px solid #cbd5e1;">
                    <th style="padding: 8px 12px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">Date &amp; Day</th>
                    <th style="padding: 8px 12px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">Duty Window</th>
                    <th style="padding: 8px 12px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">Clinical Pairing</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml || '<tr><td colspan="3" style="padding: 16px; text-align: center; color: #94a3b8;">No active duty shifts assigned for this period.</td></tr>'}
                </tbody>
              </table>

              <!-- Call to Actions -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 28px; margin-bottom: 12px;">
                <tr>
                  <td align="center">
                    <a href="${ackUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 6px; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);">
                      ✓ Confirm Receipt &amp; Acknowledge Schedule
                    </a>
                  </td>
                </tr>
                ${privateRosterUrl ? `<tr>
                  <td align="center" style="padding-top: 14px;">
                    <a href="${h(privateRosterUrl)}" style="font-size: 13px; font-weight: 600; color: #4338ca; text-decoration: underline;">
                      Open my schedule and team roster
                    </a>
                  </td>
                </tr>` : ''}
                ${viewUrl ? `<tr>
                  <td align="center" style="padding-top: 12px;">
                    <a href="${h(viewUrl)}" style="font-size: 12px; color: #6366f1; text-decoration: underline;">
                      View the roster online
                    </a>
                  </td>
                </tr>` : ''}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5; text-align: center;">
              <p style="margin: 0 0 6px 0;">This is an automated operational broadcast from ClinicRoster for <strong>${h(nurse.fullName)}</strong> (${h(nurse.employeeCode)}).</p>
              <p style="margin: 0;">Clinic Operations Office · ${h(clinicName)} · Published on ${new Date(version.timestamp).toLocaleString()}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return { subject, bodyPreview, html };
  }

  /**
   * Short reminder email asking a nurse to confirm receipt of their roster.
   * Every user supplied value is HTML escaped.
   */
  public static generateReminderEmailHtml(params: {
    clinicName: string;
    scheduleName: string;
    versionNumber?: number;
    nurse: Nurse;
    ackToken: string;
    shareToken?: string;
    /** The nurse's private page with personal and team schedules, when available. */
    privateRosterUrl?: string;
  }): { subject: string; bodyPreview: string; html: string } {
    const h = escapeHtml;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const ackUrl = `${origin}/#ack?token=${encodeURIComponent(params.ackToken)}`;
    const viewUrl = params.shareToken
      ? `${origin}/#published?token=${encodeURIComponent(params.shareToken)}&nurse=${encodeURIComponent(params.nurse.id)}`
      : '';
    const subject = `Reminder: please confirm your roster — ${params.scheduleName}`;
    const bodyPreview = `Reminder for ${params.nurse.fullName} to confirm receipt of ${params.scheduleName}.`;
    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px;">
  <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">${h(params.clinicName)}</p>
  <h2 style="margin: 0 0 12px 0; font-size: 16px;">Dear ${h(params.nurse.fullName)},</h2>
  <p style="font-size: 14px; line-height: 1.6;">Your duty roster for <strong>${h(params.scheduleName)}</strong>${
      params.versionNumber ? ` (version ${params.versionNumber})` : ''
    } was published, but we have not yet received your confirmation. Please review it and confirm receipt.</p>
  <p style="text-align: center; margin: 24px 0;">
    <a href="${h(ackUrl)}" style="display: inline-block; background-color: #b45309; color: #ffffff; text-decoration: none; font-weight: 700; padding: 12px 22px; border-radius: 6px;">Confirm Receipt of My Roster</a>
  </p>
  ${params.privateRosterUrl ? `<p style="text-align: center; font-size: 13px;"><a href="${h(params.privateRosterUrl)}" style="color: #4338ca; font-weight: 600;">Open my schedule and team roster</a></p>` : ''}
  ${viewUrl ? `<p style="text-align: center; font-size: 12px;"><a href="${h(viewUrl)}" style="color: #4f46e5;">${params.privateRosterUrl ? 'View the whole roster' : 'View my roster'}</a></p>` : ''}
</div>`;
    return { subject, bodyPreview, html };
  }

  /**
   * Dispatches an individual nurse email payload using Google Email Dispatch (Mock Sandbox or Live Google SMTP)
   */
  public static async dispatchEmail(
    emailConfig: EmailSettingsConfig,
    recipientEmail: string,
    nurse: Nurse,
    subject: string,
    bodyPreview: string,
    fullBodyHtml: string,
    scheduleId: string,
    versionId: string,
    ackToken: string
  ): Promise<DispatchResult> {
    // The acknowledgment document id is the emailed token, so the nurse can
    // confirm receipt from the link without signing in (see firestore.rules).
    const ack: Acknowledgment = {
      id: ackToken,
      scheduleId,
      nurseId: nurse.id,
      versionId,
      token: ackToken,
      sentAt: new Date().toISOString(),
    };

    const recipientLog: EmailRecipientLog = {
      email: recipientEmail,
      nurseId: nurse.id,
      nurseName: nurse.fullName,
      subject,
      bodyPreview,
      fullBodyHtml,
      status: 'MOCK_SENT',
    };

    // Recipient email validation for Google accounts
    const isGoogle = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim().toLowerCase());
    if (!isGoogle) {
      recipientLog.status = 'FAILED';
      recipientLog.errorMessage = `Invalid recipient email address "${recipientEmail}". Must be a valid Google account.`;
      return { recipientLog, acknowledgment: ack };
    }

    // 1. Mock Mode (Default Safe Sandbox)
    if (emailConfig.mockMode || emailConfig.provider === 'MOCK') {
      recipientLog.status = 'MOCK_SENT';
      return { recipientLog, acknowledgment: ack };
    }

    // 2. Live Google Provider Dispatch via Server API
    try {
      const token = await authService.getFreshToken();
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // SMTP settings are configured on the server (AI Studio Secrets) and are never sent from the browser.
        body: JSON.stringify({
          to: recipientEmail,
          provider: 'GOOGLE',
          subject,
          html: fullBodyHtml,
          scheduleId,
          nurseId: nurse.id,
          versionId,
          config: {
            provider: 'GOOGLE',
            mockMode: false,
            senderName: emailConfig.senderName,
          },
        }),
      });

      const json = await readEmailResponse(response);
      if (response.ok) {
        // The server reports the real delivery result in data.status.
        if (json.data?.status === 'SENT' || json.data?.status === 'MOCK_SENT') {
          recipientLog.status = json.data.status;
        } else {
          recipientLog.status = 'FAILED';
          recipientLog.errorMessage = json.data?.error || 'Dispatch error returned from server';
        }
      } else {
        recipientLog.status = 'FAILED';
        recipientLog.errorMessage = json.message || `Server returned ${response.status}: ${response.statusText}`;
      }
    } catch (err: any) {
      console.warn('[rosterPublishService] Server Google dispatch network error:', err);
      recipientLog.status = 'FAILED';
      recipientLog.errorMessage = err.message || 'Network error during Google dispatch';
    }

    return { recipientLog, acknowledgment: ack };
  }

  /**
   * Process receipt confirmation / acknowledgment by token
   */
  public static async acknowledgeByToken(token: string): Promise<boolean> {
    if (!token) return false;
    const repo = getRepository();
    try {
      // Current links: the document id is the token (readable without signing in).
      const ack = await repo.get('acknowledgments', token);
      if (ack && ack.token === token) {
        if (!ack.ackAt) {
          await repo.update('acknowledgments', ack.id, { ackAt: new Date().toISOString() });
        }
        return true;
      }
    } catch {
      // Not readable by token: fall through to the signed in lookup below.
    }

    try {
      // Older links (document id differs from the token): a signed in nurse may look
      // through their own read receipts (the database rules allow only that query).
      const user = authService.getCurrentUser();
      const acks = canEditClinicData(user)
        ? await repo.list('acknowledgments', { field: 'token', operator: '==', value: token })
        : user?.linkedNurseId
        ? await repo.list('acknowledgments', { field: 'nurseId', operator: '==', value: user.linkedNurseId })
        : [];
      const matched = acks.find((a) => a.token === token);
      if (!matched) return false;
      if (!matched.ackAt) {
        await repo.update('acknowledgments', matched.id, { ackAt: new Date().toISOString() });
      }
      return true;
    } catch {
      return false;
    }
  }
}
