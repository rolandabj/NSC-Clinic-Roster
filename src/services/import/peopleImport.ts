/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The nurses and doctors CSV import (Phase 7, slice 3c): each row is read as written and every
 * problem in it is named. Nothing is made up: a missing date of birth stays empty (the nurse
 * editor asks for it), a missing employee code takes the first free one, and a doctor's usual
 * week comes from the file. (The import once gave every doctor Sunday and Tuesday 09:00 to
 * 13:00, every nurse without a date of birth 01-01-1995 and a random code, and swapped an
 * unknown level or specialty for another one without saying so.)
 */

import type { ClinicalRole, Doctor, Nurse, SeniorityLevel, Specialty, WeeklyPatternSlot } from '../../types';
import { parseDayMonthYear } from '../../utils/dateUtils';
import { nextEmployeeCode } from '../nurses/nurseForm';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const cellsOf = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(1)
    .map((line) => line.split(',').map((v) => v.trim()));

export interface NurseImportRow {
  nurse: Pick<Nurse, 'fullName' | 'gmail' | 'employeeCode' | 'seniorityLevelId' | 'contractPercent' | 'dateOfBirth' | 'capabilityIds'>;
  problems: string[];
}

export function readNurseRows(
  text: string,
  data: {
    levels: Pick<SeniorityLevel, 'id' | 'name'>[];
    roles: Pick<ClinicalRole, 'id' | 'name' | 'acronym'>[];
    nurses: Pick<Nurse, 'fullName' | 'gmail' | 'employeeCode'>[];
    today: string;
  }
): NurseImportRow[] {
  const rows: NurseImportRow[] = [];
  for (const [fullName = '', gmail = '', code = '', levelName = '', contract = '', birth = '', skills = ''] of cellsOf(text)) {
    const problems: string[] = [];
    const same = (a: string | undefined, b: string) => (a || '').trim().toLowerCase() === b.trim().toLowerCase();
    if (!fullName) problems.push('no name');

    if (!EMAIL.test(gmail)) problems.push(gmail ? `${gmail} is not an email address` : 'no email address');
    else {
      const owner = data.nurses.find((n) => same(n.gmail, gmail));
      const earlier = rows.findIndex((r) => same(r.nurse.gmail, gmail));
      if (owner) problems.push(`${owner.fullName} already has the email ${gmail}`);
      else if (earlier >= 0) problems.push(`row ${earlier + 1} already has the email ${gmail}`);
    }

    let employeeCode = code;
    if (code) {
      const owner = data.nurses.find((n) => same(n.employeeCode, code));
      const earlier = rows.findIndex((r) => same(r.nurse.employeeCode, code));
      if (owner) problems.push(`${owner.fullName} already has the code ${code}`);
      else if (earlier >= 0) problems.push(`row ${earlier + 1} already has the code ${code}`);
    } else {
      employeeCode = nextEmployeeCode([...data.nurses, ...rows.map((r) => r.nurse)]);
    }

    const level = levelName ? data.levels.find((l) => same(l.name, levelName)) : undefined;
    if (!level) problems.push(levelName ? `no nurse level is called ${levelName} (${data.levels.map((l) => l.name).join(', ')})` : 'no nurse level');

    const contractPercent = contract === '' ? 100 : Number(contract);
    if (!Number.isInteger(contractPercent) || contractPercent < 10 || contractPercent > 100) problems.push('the contract must be a whole number from 10 to 100');

    const dateOfBirth = birth ? parseDayMonthYear(birth) : '';
    if (birth && !dateOfBirth) problems.push(`${birth} is not a date`);
    else if (dateOfBirth && dateOfBirth > data.today) problems.push('the date of birth is after today');

    const capabilityIds: string[] = [];
    for (const skill of skills ? skills.split(';').map((v) => v.trim()).filter(Boolean) : []) {
      const role = data.roles.find((r) => same(r.name, skill) || same(r.acronym, skill));
      if (role) capabilityIds.push(role.id);
      else problems.push(`no nurse skill is called ${skill}`);
    }
    // With no skills given, the first skill (as before).
    if (!skills && data.roles[0]) capabilityIds.push(data.roles[0].id);

    rows.push({ nurse: { fullName, gmail, employeeCode, seniorityLevelId: level?.id || '', contractPercent, dateOfBirth, capabilityIds }, problems });
  }
  return rows;
}

export interface DoctorImportRow {
  doctor: Pick<Doctor, 'fullName' | 'gmail' | 'specialtyIds' | 'weeklyPattern'>;
  problems: string[];
}

export function readDoctorRows(
  text: string,
  data: { specialties: Pick<Specialty, 'id' | 'name' | 'code'>[]; doctors: Pick<Doctor, 'fullName' | 'gmail'>[] }
): DoctorImportRow[] {
  const rows: DoctorImportRow[] = [];
  for (const [fullName = '', gmail = '', specialtyText = '', patternText = ''] of cellsOf(text)) {
    const problems: string[] = [];
    const same = (a: string | undefined, b: string) => (a || '').trim().toLowerCase() === b.trim().toLowerCase();
    if (!fullName) problems.push('no name');
    if (gmail && !EMAIL.test(gmail)) problems.push(`${gmail} is not an email address`);
    else if (gmail) {
      const owner = data.doctors.find((d) => same(d.gmail, gmail));
      if (owner) problems.push(`${owner.fullName} already has the email ${gmail}`);
    }

    const specialtyIds: string[] = [];
    const names = specialtyText.split(';').map((v) => v.trim()).filter(Boolean);
    if (names.length === 0) problems.push('no specialty');
    for (const name of names) {
      const sp = data.specialties.find((x) => same(x.name, name) || same(x.code, name));
      if (sp) specialtyIds.push(sp.id);
      else problems.push(`no specialty is called ${name}`);
    }

    const weeklyPattern: WeeklyPatternSlot[] = [];
    for (const slot of patternText.split(';').map((v) => v.trim()).filter(Boolean)) {
      const m = /^([A-Za-z]{3})[a-z]*\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})(?:\s+(.+))?$/.exec(slot);
      const weekday = m ? WEEKDAYS.indexOf(m[1].toLowerCase()) : -1;
      if (!m || weekday < 0 || m[3] <= m[2]) {
        problems.push(`"${slot}" is not a clinic like Sun 09:00-13:00 Room 1`);
        continue;
      }
      weeklyPattern.push({ weekday, startTime: m[2], endTime: m[3], room: m[4] || '' });
    }

    rows.push({ doctor: { fullName, gmail: gmail || undefined, specialtyIds, weeklyPattern }, problems });
  }
  return rows;
}
