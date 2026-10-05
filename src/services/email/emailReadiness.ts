import { authorizedFetch } from '../auth/authService';
import { readEmailResponse } from './emailResponse';

export interface EmailReadiness { ready: boolean; message: string; sender: string }

/** Connection checks authenticate to SMTP but never send mail. */
export async function checkEmailReadiness(verify = false): Promise<EmailReadiness> {
  const response = await authorizedFetch(`/api/email/${verify ? 'check' : 'status'}`, {
    method: verify ? 'POST' : 'GET', signal: AbortSignal.timeout(45000),
  });
  const json = await readEmailResponse(response);
  if (typeof json.data?.ready === 'boolean') return json.data;
  throw new Error(json.message || `Email service unavailable (${response.status}). Open the deployed app and sign in again.`);
}
