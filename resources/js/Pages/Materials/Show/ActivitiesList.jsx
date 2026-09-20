export default function ActivitiesList({ activities }) {
    if (activities.length === 0) {
        return null;
    }

    return (
        <div className="card p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-primary-950">Aktivitas Pembelajaran</h2>
            <ul className="mt-4 space-y-4">
                {activities.map((activity) => (
                    <li key={activity.id} className="rounded-xl border border-primary-100 bg-primary-50/50 p-4">
                        <p className="font-medium text-primary-900">{activity.title}</p>
                        {activity.instruction && <p className="mt-1 text-sm text-primary-500">{activity.instruction}</p>}
                        {activity.information && <p className="mt-2 text-sm text-primary-600">{activity.information}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
