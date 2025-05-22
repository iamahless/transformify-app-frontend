import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router";
import Select from 'react-select';

// Utility functions
const formatDateTime = (dt) => dt.replace('T', ' ');
const pad = (n) => n.toString().padStart(2, '0');
const getMinDate = () => {
	const today = new Date();
	return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}T${pad(today.getHours())}:${pad(today.getMinutes())}`;
};

const initialFormState = {
	title: "",
	description: "",
	schedulerName: "",
	schedulerEmail: "",
	startAt: "",
	endAt: "",
	participants: [],
};

function CreateAppointment({ open, setOpen, fetchAppointments }) {
	const [form, setForm] = useState(initialFormState);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [participants, setParticipants] = useState([]);
	const navigate = useNavigate();

	const baseUrl = import.meta.env.VITE_API_URL;

	const participantOptions = useMemo(
		() => participants.map(({ id, name }) => ({ value: id, label: name })),
		[participants]
	);

	useEffect(() => {
		const fetchParticipants = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${baseUrl}/participants`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});
				const data = await response.json();
				setParticipants(data.participants || []);
			} catch {
				setError("Failed to load participants.");
			} finally {
				setLoading(false);
			}
		};
		fetchParticipants();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleParticipantsChange = (selectedOptions) => {
		setForm((prev) => ({
			...prev,
			participants: selectedOptions ? selectedOptions.map(item => item.value) : [],
		}));
	};

	const handleClose = () => {
		setOpen(false);
		setError(null);
		setForm(initialFormState);
	};

	const submitHandle = async (event) => {
		event.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const response = await fetch(`${baseUrl}/appointments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: form.title,
					description: form.description,
					scheduler_name: form.schedulerName,
					scheduler_email: form.schedulerEmail,
					participants: form.participants,
					start_at: formatDateTime(form.startAt),
					end_at: formatDateTime(form.endAt),
				}),
			});
			if (!response.ok) {
				const data = await response.json();
				throw new Error(data?.message || "Failed to create appointment.");
			}
			handleClose();
			if (fetchAppointments) await fetchAppointments();
			navigate("/appointments/");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const minDate = getMinDate();

	return (
		<Dialog open={open} onClose={handleClose} className="relative z-10">
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
							<form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl" onSubmit={submitHandle}>
								<div className="flex-1">
									<div className="bg-gray-50 px-4 py-6 sm:px-6">
										<div className="flex items-start justify-between space-x-3">
											<div className="space-y-1">
												<DialogTitle className="text-base font-semibold text-gray-900">New Appointment</DialogTitle>
												<p className="text-sm text-gray-500">
													Get started by filling in the information below to create your new appointment.
												</p>
											</div>
											<div className="flex h-7 items-center">
												<button
													type="button"
													onClick={handleClose}
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
										{/* Title */}
										<div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
											<div>
												<label htmlFor="title" className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">
													Title
												</label>
											</div>
											<div className="sm:col-span-2">
												<input
													id="title"
													name="title"
													value={form.title}
													onChange={handleChange}
													type="text"
													required
													className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
												/>
											</div>
										</div>
										{/* Description */}
										<div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
											<div>
												<label htmlFor="description" className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">
													Description
												</label>
											</div>
											<div className="sm:col-span-2">
												<textarea
													id="description"
													name="description"
													required
													value={form.description}
													onChange={handleChange}
													rows={2}
													className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
												/>
											</div>
										</div>
										{/* Scheduler Name */}
										<div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
											<div>
												<label htmlFor="schedulerName" className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">
													Scheduler Name
												</label>
											</div>
											<div className="sm:col-span-2">
												<input
													id="schedulerName"
													name="schedulerName"
													value={form.schedulerName}
													onChange={handleChange}
													type="text"
													required
													className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
												/>
											</div>
										</div>
										{/* Scheduler Email */}
										<div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
											<div>
												<label htmlFor="schedulerEmail" className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">
													Scheduler Email
												</label>
											</div>
											<div className="sm:col-span-2">
												<input
													id="schedulerEmail"
													name="schedulerEmail"
													value={form.schedulerEmail}
													onChange={handleChange}
													type="email"
													required
													className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
												/>
											</div>
										</div>
										{/* Participants */}
										<div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
											<div>
												<label htmlFor="participants" className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">
													Participants
												</label>
											</div>
											<div className="sm:col-span-2">
												<Select
													id="participants-select"
													isMulti
													options={participantOptions}
													onChange={handleParticipantsChange}
													isLoading={loading}
													isClearable
													placeholder="Select participants..."
													value={participantOptions.filter(option => form.participants.includes(option.value))}
												/>
											</div>
										</div>
										{/* Start Date */}
										<div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
											<div>
												<label htmlFor="startAt" className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">
													Start Date
												</label>
											</div>
											<div className="sm:col-span-2">
												<input
													id="startAt"
													name="startAt"
													value={form.startAt}
													onChange={handleChange}
													type="datetime-local"
													required
													min={minDate}
													className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
												/>
											</div>
										</div>
										{/* End Date */}
										<div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
											<div>
												<label htmlFor="endAt" className="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">
													End Date
												</label>
											</div>
											<div className="sm:col-span-2">
												<input
													id="endAt"
													name="endAt"
													value={form.endAt}
													onChange={handleChange}
													type="datetime-local"
													required
													min={form.startAt}
													className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
												/>
											</div>
										</div>
									</div>
								</div>
								{/* Footer */}
								<div className="shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
									<div className="flex justify-end space-x-3">
										<button
											type="button"
											onClick={handleClose}
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

export default CreateAppointment;