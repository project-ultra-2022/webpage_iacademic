import type { PageServerLoad } from './$types';
import type { BaseCourse } from '$lib/types';

export const prerender = true;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const load: PageServerLoad = async () => {
	const response = await fetch(process.env.NEXT_PUBLIC_ORCHESTRATOR_URL + `/v2/public-courses/`);
	if (!response.ok) {
		throw new Error('Error al obtener los datos del API');
	}
	const data = await response.json();
	console.log('data', data);
	const courses: BaseCourse[] = JSON.parse(data.data);

	return { courses };
};
