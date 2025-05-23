import {
	ClockIcon,
	UsersIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const actions = [
	{
		title: 'Appointments',
		description: 'Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.',
		href: '/appointments',
		icon: ClockIcon,
		iconForeground: 'text-teal-700',
		iconBackground: 'bg-teal-50',
	},
	{
		title: 'Participants',
		description: 'Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.',
		href: '/participants',
		icon: UsersIcon,
		iconForeground: 'text-sky-700',
		iconBackground: 'bg-sky-50',
	},
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}


export default function Home() {
	return (
		<>
			<div className="py-10">
				<header>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
					</div>
				</header>
				<main>
					<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
						<div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow-sm sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
							{actions.map((action, actionIdx) => (
								<div
									key={action.title}
									className={classNames(
										actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
										actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
										actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
										actionIdx === actions.length - 1 ? 'rounded-br-lg rounded-bl-lg sm:rounded-bl-none' : '',
										'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-inset',
									)}
								>
									<div>
										<span
											className={classNames(
												action.iconBackground,
												action.iconForeground,
												'inline-flex rounded-lg p-3 ring-4 ring-white',
											)}
										>
											<action.icon aria-hidden="true" className="size-6" />
										</span>
									</div>
									<div className="mt-8">
										<h3 className="text-base font-semibold text-gray-900">
											<Link to={action.href} className="focus:outline-hidden">
												<span aria-hidden="true" className="absolute inset-0" />
												{action.title}
											</Link>
										</h3>
										<p className="mt-2 text-sm text-gray-500">
											{action.description}
										</p>
									</div>
									<span
										aria-hidden="true"
										className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
									>
										<svg fill="currentColor" viewBox="0 0 24 24" className="size-6">
											<path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
										</svg>
									</span>
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</>
	)
}
