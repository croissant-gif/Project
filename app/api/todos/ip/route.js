import { execSync } from 'child_process';

export async function GET() {
  let ip = null;

  // Try to get the local IP from the wireless LAN adapter
  try {
    
    const output = execSync('ipconfig').toString();
    const match = output.match(/Wireless LAN adapter Wi-Fi.*?IPv4 Address.*?: (\d+\.\d+\.\d+\.\d+)/s);
    ip = match ? match[1] : 'IP not found';
  } catch (error) {
    
    try {
      const output = execSync('ifconfig').toString();
      const match = output.match(/inet (\d+\.\d+\.\d+\.\d+)/);
      ip = match ? match[1] : 'IP not found';
    } catch (e) {
      ip = 'IP not found';
    }
  }

  return new Response(
    JSON.stringify({ ip: ip || 'IP not found' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
