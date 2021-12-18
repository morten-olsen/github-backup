require('dotenv').config();
import runBackup from './run';
import { program } from 'commander';
import cron from 'node-cron';

const run = program.command('run');
run.action(runBackup)

const schedule = program.command('schedule');
schedule.action(() => {
  const schedule = process.env.SCHEDULE || '0 0 3 * * Sunday';
  cron.schedule(schedule, () => {
    runBackup().catch((err) => {
      console.error(err);
      process.exit(-1);
    });
  });
});

program.parse(process.argv);
