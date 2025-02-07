## Manage tasks demo

A dashboard to manage tasks for legal matters.

Run `npm install`, `npm run dev`, and go to http://localhost:3000/

Three main files:
- `app/page.tsx` - the main dashboard to show all tasks
- `app/components/Task.tsx` - the component to interact with each task
- `app/components/types.ts` - keep track of properties and requirements for each task

Design decisions:
- The current app is a single page, frontend app built with Next.js. I think it makes a pretty clean implementation. I mainly use the types to keep track of each task's properties and requirements. Then I pass each task's status as props into the Task component. If there is more shared state, then I'd consider implementing a context provider.

Future expansion:
- A good implementation in the future would be to use a database for persistent storage. This means creating a backend API and connecting it to the database, then have the frontend fetch from the API to do CRUD operations. Additionally, it'd be cool to have some way to verify that the task is completed instead of just clicking a button. For example, a task could be a form that the user has to upload.

Production architecture:
- For production, I'd deploy this app on Vercel. The next step would be to create a login for users so we can keep all their data separate. I'm thinking something like Supabase for row level security. Finally, we'd need to implement logging and monitoring, so I'd probably use Sentry or Axiom.
