import Header from '@/components/Header';

// TODO (issue 13): MyMealPlan component
export default function MyMealPlan(props) {
  return (
    <>
      <Header />
      <iframe
        title="calendar"
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&src=primary&color=%23039BE5"
        style={{ borderWidth: 0 }}
        width="800"
        height="600"
      ></iframe>
    </>
  );
}
