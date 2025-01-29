import useSWR from 'swr';

interface Event {
    id: string;
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    days?: string[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const EventList = ({ calendarId }: { calendarId: string }) => {
    const { data, error } = useSWR(`/api/events?calendarId=${calendarId}`, fetcher);

    if (error) return <div>Failed to load events</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <ul>
        {data.events.map((event: Event) => (
            <li key={event.id}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <span>{event.startTime} - {event.endTime}</span>
            </li>
        ))}
        </ul>
    );
};

export default EventList;
