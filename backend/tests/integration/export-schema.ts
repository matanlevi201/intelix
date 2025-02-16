import { exec } from "child_process";

const command = "npx drizzle-kit export --dialect=postgresql --schema=./src/database/schema.ts";

export const getCurrentSchema = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};
