/** A preview or hosting fallback can return index.html with HTTP 200. Never count it as a send. */
export async function readEmailResponse(response: Response): Promise<any> {
  const body = await response.text();
  if (/^\s*(?:<!doctype\s+html|<html\b)/i.test(body) || response.headers.get('content-type')?.includes('text/html')) {
    throw new Error('The email API returned a web page instead of a server response. Restart the AI Studio preview with the updated app, or ask the app administrator to check the server routing. No email was confirmed as sent.');
  }
  try {
    const result = JSON.parse(body);
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('Invalid response');
    return result;
  } catch {
    throw new Error(`The email server returned an unreadable response (HTTP ${response.status}). Check the server and try again.`);
  }
}
