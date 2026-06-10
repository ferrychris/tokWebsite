<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { createClient } from '$lib/supabase/client';
	import { Shield, User, Ban } from 'lucide-svelte';

	let { data } = $props();
	let users = $state(data.users || []);
	const supabase = createClient();
	const fc = (n: number) => `\u20A6${n.toLocaleString()}`;

	async function updateRole(id: string, role: string) {
		await supabase.from('profiles').update({ role }).eq('id', id);
		users = users.map((u: any) => u.id === id ? { ...u, role } : u);
	}
</script>

<div>
	<h1 class="text-3xl font-bold mb-8">Manage Users</h1>
	<Card>
		<div class="p-6">
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b text-left">
							<th class="pb-3 font-medium text-muted-foreground">Name</th>
							<th class="pb-3 font-medium text-muted-foreground">Email</th>
							<th class="pb-3 font-medium text-muted-foreground">Role</th>
							<th class="pb-3 font-medium text-muted-foreground">Balance</th>
							<th class="pb-3 font-medium text-muted-foreground">Joined</th>
							<th class="pb-3 font-medium text-muted-foreground">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each users as u}
							<tr class="border-b last:border-0">
								<td class="py-3 pr-4 font-medium">{u.name || '-'}</td>
								<td class="py-3 pr-4 text-muted-foreground">{u.email}</td>
								<td class="py-3 pr-4">
									<Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge>
								</td>
								<td class="py-3 pr-4">{fc(u.wallet?.balance || 0)}</td>
								<td class="py-3 pr-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
								<td class="py-3">
									<div class="flex gap-2">
										{#if u.role !== 'admin'}
											<button onclick={() => updateRole(u.id, 'admin')} class="text-xs text-primary hover:underline flex items-center gap-1">
												<Shield class="h-3 w-3" /> Make Admin
											</button>
										{:else}
											<button onclick={() => updateRole(u.id, 'creator')} class="text-xs text-muted-foreground hover:underline flex items-center gap-1">
												<User class="h-3 w-3" /> Make User
											</button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</Card>
</div>
