export function load({ locals }: { locals: App.Locals }) {
	return { user: locals.user, profile: locals.profile };
}
