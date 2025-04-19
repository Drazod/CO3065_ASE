import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const [selectedDate, setSelectedDate] = useState(null);

<DatePicker
  selected={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  placeholderText="Check Available"
  className="px-4 py-2 border rounded bg-white"
/>
