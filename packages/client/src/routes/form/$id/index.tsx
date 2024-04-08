import Form from '../../../components/Form';
import type { FormsStore } from '../../../Store';
import { createFileRoute } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';
export const Route = createFileRoute('/form/$id/')({
  component: Comp,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(
      queryOptions({
        queryKey: ['posts', { id }],
        queryFn: async () => {
          const res = await fetch(`http://localhost:3000/form/${id}`);
          return res.json() as Promise<
            Parameters<FormsStore['load']>[0]
          >;
        },
      })
    );
  },
});
function Comp() {
  const { id } = Route.useParams();
  const data = Route.useLoaderData();
  return <Form data={data} id={id} preview={false} />;
}
