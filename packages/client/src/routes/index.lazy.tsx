import { createLazyFileRoute } from '@tanstack/react-router';

function Index() {
  // Show all the form
  return <>TODO: Add list</>;
}

export const Route = createLazyFileRoute('/')({
  component: Index,
});
