import Form from '../../../components/Form';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/form/$id/preview')({
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  component: Comp,
});
function Comp() {
  const { id } = Route.useParams();
  return <Form id={id} preview />;
}
