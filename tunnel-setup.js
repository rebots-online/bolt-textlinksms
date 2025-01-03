import { createInterface } from 'node:readline';

    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    function askQuestion(query) {
      return new Promise((resolve) => {
        readline.question(query, (answer) => {
          resolve(answer);
        });
      });
    }

    async function main() {
      const tunnelName = await askQuestion('Enter your Cloudflare tunnel name: ');
      const localPort = await askQuestion('Enter the local port your app is running on (e.g., 3000): ');
      const subdomain = await askQuestion('Enter the subdomain you want to use (e.g., sms): ');
      const domain = await askQuestion('Enter your domain name (e.g., example.com): ');

      const createCommand = `cloudflared tunnel create ${tunnelName}`;
      const routeCommand = `cloudflared tunnel route dns ${tunnelName} ${subdomain}.${domain}`;
      const runCommand = `cloudflared tunnel run ${tunnelName} --url http://localhost:${localPort}`;

      console.log('\nHere are the commands to set up your Cloudflare Tunnel:');
      console.log('----------------------------------------------------');
      console.log(`1. Create the tunnel:\n   ${createCommand}`);
      console.log(`\n2. Route the tunnel to your domain:\n   ${routeCommand}`);
      console.log(`\n3. Run the tunnel:\n   ${runCommand}`);
      console.log('----------------------------------------------------');
      console.log('\nCopy and paste these commands into your terminal to set up the tunnel.');

      readline.close();
    }

    main();
