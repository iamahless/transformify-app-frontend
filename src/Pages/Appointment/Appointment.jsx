import { useEffect, useState } from "react";
import CreateAppointment from "../../Components/Drawers/CreateAppointment";
import UpdateAppointment from "../../Components/Drawers/UpdateAppointment";

function Appointment() {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [selectedAppoinment, setSelectedAppoinment] = useState(null);
	const [updateOpen, setUpdateOpen] = useState(false);

	const fetchAppointments = async () => {
		const response = await fetch("http://appointment-app-backend.test/appointments", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();

		setAppointments(data.appointments);
		setLoading(false);
	}

	useEffect(() => {
		fetchAppointments();
	}, []);

	const handleDelete = async (id, title) => {
		const confirmed = window.confirm(`Are you sure you want to delete the appointment "${title}"?`);
		if (!confirmed) return;

		const response = await fetch(`http://appointment-app-backend.test/appointments/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			fetchAppointments();
		} else {
			alert("Failed to delete appointment.");
		}
	};

	return (
		<>
			<CreateAppointment open={open} setOpen={setOpen} fetchAppointments={fetchAppointments} />

			<UpdateAppointment open={updateOpen} setOpen={setUpdateOpen} fetchAppointments={fetchAppointments} appointment={selectedAppoinment} />

			<div className="py-10">
				<header>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">Appointment</h1>
					</div>
				</header>
				<main>
					<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
						<div>
							<div className="sm:flex sm:items-center">
								<div className="sm:flex-auto">
									<h1 className="text-base font-semibold text-gray-900">Appointments</h1>
									<p className="mt-2 text-sm text-gray-700">
										A list of all the appointments booked their participants and
										availability.
									</p>
								</div>
								<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
									<button
										onClick={() => setOpen(true)}
										type="button"
										className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									>
										Add Appointment
									</button>
								</div>
							</div>
							{loading ? (
								<div className="mt-8 text-center text-gray-500">Loading...</div>
							) : (
								<div className="mt-8 flow-root">
									<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
										<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
											<table className="min-w-full divide-y divide-gray-300">
												<thead>
													<tr>
														<th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
															Appointment
														</th>
														<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
															Scheduler
														</th>
														<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
															Participants
														</th>
														<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
															Date
														</th>
														<th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
															<span className="sr-only">Edit</span>
														</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-200">
													{appointments.map((appointment) => (
														<tr key={appointment.id}>
															<td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-500 sm:pl-0">
																<span className="text-gray-900">{appointment.title}</span><br />
																{appointment.description}
															</td>
															<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
																{appointment.scheduler_name}<br />
																{appointment.scheduler_email}
															</td>
															<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
																{appointment.participants.map((participant) => (
																	<div key={participant.id}>{participant.name}</div>
																))}
															</td>
															<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{appointment.start_at} - {appointment.end_at}</td>
															<td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
																<button
																	onClick={() => {
																		setUpdateOpen(true);
																		setSelectedAppoinment(appointment);
																	}}
																	className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
																	Update<span className="sr-only">, {appointment.title}</span>
																</button>
																<button
																	onClick={() => handleDelete(appointment.id, appointment.title)}
																	className="pl-3 text-red-600 hover:text-red-900 bg-transparent border-none cursor-pointer"
																>
																	Delete<span className="sr-only">, {appointment.title}</span>
																</button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</main >
			</div >
		</>
	);
}

export default Appointment;