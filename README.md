# mixpanel event export

Export event from Mixpanel by device UUID.

- Set `MIXPANEL_API_KEY` and `MIXPANEL_API_SECRET` in the environment, or in `.env`
- Run `npm run report`
- Change the number of devices reported by setting `MAXCOUNT`, which is 30 by default
- Change the number of days to sum over by setting `DAYS`, which is 3 by default
