import { useStore } from "./store";

export default function DentalControls() {
  const { selectedTooth, setToothCondition, toothConditions } = useStore();

  const conditions = [
    { id: 'cleaning', label: 'Needs Cleaning', color: 'brown' },
    { id: 'filling', label: 'Needs Filling', color: 'red' },
    { id: 'extraction', label: 'Needs Extraction', color: 'purple' }
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dental Chart Controls</h2>
      
      {selectedTooth ? (
        <>
          <p className="mb-4">Selected Tooth: #{selectedTooth}</p>
          <div className="space-y-2">
            {conditions.map(({ id, label, color }) => (
              <button
                key={id}
                className={`w-full p-2 rounded ${
                  toothConditions[selectedTooth]?.[`needs${id.charAt(0).toUpperCase() + id.slice(1)}`]
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
                onClick={() => setToothCondition(selectedTooth, id)}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>Select a tooth to mark conditions</p>
      )}
    </div>
  );
}