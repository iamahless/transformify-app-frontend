import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";

import Appointment from '../Pages/Appointment/Appointment';
import Home from "../Pages/Home/Home";
import Participant from '../Pages/Participant/Participant';

const navigation = [
	{ name: 'Dashboard', href: '/' },
	{ name: 'Appointments', href: '/appointments' },
	{ name: 'Participants', href: '/participants' },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

function NavLinks() {
	const location = useLocation();
	return (
		<>
			{navigation.map((item) => {
				const isCurrent = location.pathname === item.href;
				return (
					<Link
						key={item.name}
						to={item.href}
						aria-current={isCurrent ? 'page' : undefined}
						className={classNames(
							isCurrent
								? 'border-indigo-500 text-gray-900'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
							'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
						)}
					>
						{item.name}
					</Link>
				)
			})}
		</>
	)
}

function MobileNavLinks({ close }) {
	const location = useLocation();
	return (
		<>
			{navigation.map((item) => {
				const isCurrent = location.pathname === item.href;
				return (
					<Link
						key={item.name}
						to={item.href}
						onClick={close}
						aria-current={isCurrent ? 'page' : undefined}
						className={classNames(
							isCurrent
								? 'border-indigo-500 bg-indigo-50 text-indigo-700'
								: 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
							'block border-l-4 py-2 pr-4 pl-3 text-base font-medium',
						)}
					>
						{item.name}
					</Link>
				)
			})}
		</>
	)
}

function MainLayout() {
	return (
		<BrowserRouter>
			<div className="min-h-full">
				<Disclosure as="nav" className="border-b border-gray-200 bg-white">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 justify-between">
							<div className="flex">
								<div className="flex shrink-0 items-center">
									<h1>Appointment Scheduler</h1>
								</div>
								<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
									<NavLinks />
								</div>
							</div>
							<div className="-mr-2 flex items-center sm:hidden">
								<Disclosure.Button className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
									<span className="absolute -inset-0.5" />
									<span className="sr-only">Open main menu</span>
									<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
									<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
								</Disclosure.Button>
							</div>
						</div>
					</div>
					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 pt-2 pb-3">
							<MobileNavLinks close={close} />
						</div>
					</Disclosure.Panel>

				</Disclosure>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/appointments" element={<Appointment />} />
					<Route path="/participants" element={<Participant />} />
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default MainLayout