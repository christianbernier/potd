<div class="header">
	<h4>Admin actions</h4>
	<form method="POST" enctype="multipart/form-data">
		<button>Log out</button>
	</form>
</div>

<div class="actions">
	<ul>
		<li><a href="/admin/new">New post</a></li>
		<li><a href="/admin/edit">Edit post</a></li>
		<li><a href="/admin/delete">Delete post</a></li>
	</ul>
</div>

<style>
	div.header {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	div.actions {
		width: 100%;
		height: 100%;
	}
</style>
