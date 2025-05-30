<script lang="ts">
	let { name, required = false }: { name: string; required: boolean | undefined } = $props();
	let current = $state('');

	function imageChanged({ target }: { target: EventTarget | null }) {
		if (!target) {
			return;
		}

		const files = (target as HTMLFormElement).files;

		// if there is an image, display it
		if (files && files[0]) {
			const reader = new FileReader();
			reader.onload = ({ target }) => {
				if (!target) {
					return;
				}

				current = target.result as string;
			};

			reader.readAsDataURL(files[0]);
		}
	}
</script>

<div class="container">
	<div class="preview" style={`background-image: url(${current})`}></div>
	<label for={name}>Image:</label>
	<input {name} id={name} type="file" onchange={imageChanged} {required} />
</div>

<style>
	div.preview {
		width: 400px;
		height: 400px;
		background-color: var(--gray);
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		margin-bottom: var(--margin-md);
	}

	div.container {
		margin: var(--margin-lg) 0;
	}
</style>
