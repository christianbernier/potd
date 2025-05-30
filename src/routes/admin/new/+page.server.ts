import { error, type Actions, type NumericRange } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();
		const date = data.get('date') as string;

		const response = await fetch(`/api/posts/${date}`, {
			method: 'POST',
			body: data
		});

		if (!response.ok) {
			error(response.status as NumericRange<400, 599>, await response.json());
		}
	}
} satisfies Actions;
