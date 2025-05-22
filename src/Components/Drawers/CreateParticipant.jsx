import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from "react-router";

function CreateParticipant({ open, setOpen, fetchParticipants }) {
	const [form, setForm] = useState({
		name: "",
		email: ""
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const submitHandle = async (event) => {
		event.preventDefault();
		setError(null);
		setLoading(true);

		const response = await fetch("http://appointment-app-backend.test/participants", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: form.name,
				email: form.email,
			}),
		});

		if (response.ok) {
			setOpen(false);

			if (fetchParticipants) {
				await fetchParticipants();
			}

			navigate("/participants/");
		} else {
			const data = await response.json();
			setError(data?.message || "Failed to create par.");
		}
	};

	return (
		<Dialog open={open} onClose={setOpen} className="relative z-10">
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
			/>
			<div className="fixed inset-0" />

			<div className="fixed inset-0 overflow-hidden">
				<div className="absolute inset-0 overflow-hidden">
					<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
						<DialogPanel
							transition
							className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
						>
							<form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl" onSubmit={submitHandle} >
								<div className="flex-1">
									<div className="bg-gray-50 px-4 py-6 sm:px-6">
										<div className="flex items-start justify-between space-x-3">
											<div className="space-y-1">
												<DialogTitle className="text-base font-semibold text-gray-900">New Participant</DialogTitle>
												<p className="text-sm text-gray-500">
													Get started by filling in the information below to create a new participant.
												</p>
											</div>
											<div className="flex h-7 items-center">
												<button
													type="button"
													onClick={() => setOpen(false)}
													className="relative text-gray-400 hover:text-gray-500"
												>
													<span className="absolute -inset-2.5" />
													<span className="sr-only">Close panel</span>
													<XMarkIcon aria-hidden="true" className="size-6" />
												</button>
											</div>
										</div>
										{error && (
											<div className="mt-4 text-sm text-red-600">{error}</div>
										)}
									</div>

									<div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
										<div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
											<div>
												<label htmlFor="name" className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">
													Name
												</label>
											</div>
											<div className="sm:col-span-2">
												<input
													id="name"
													name="name"
													value={form.name}
													onChange={handleChange}
													type="text"
													required
													className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
												/>
											</div>
										</div>

										<div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
											<div>
												<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">
													Email
												</label>
											</div>
											<div className="sm:col-span-2">
												<input
													id="email"
													name="email"
													value={form.email}
													onChange={handleChange}
													type="email"
													required
													className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
												/>
											</div>
										</div>
									</div>
								</div>

								<div className="shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
									<div className="flex justify-end space-x-3">
										<button
											type="button"
											onClick={() => setOpen(false)}
											className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
											disabled={loading}
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={loading}
											className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
										>
											{loading ? "Creating..." : "Create"}
										</button>
									</div>
								</div>
							</form>
						</DialogPanel>
					</div>
				</div>
			</div>
		</Dialog>
	);
}

export default CreateParticipant;