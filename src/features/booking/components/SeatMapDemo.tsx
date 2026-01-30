import React, { useState } from 'react';

// Section and seat data (mocked for demo)
const SECTIONS = [
  { id: 'SUPER1', name: 'SUPER 1', type: 'Standing', color: '#1a4fa3', price: 6000000 },
  { id: 'SUPER2', name: 'SUPER 2', type: 'Standing', color: '#1a4fa3', price: 6000000 },
  { id: 'JUNIOR1', name: 'JUNIOR 1', type: 'Standing', color: '#4e8ef7', price: 5000000 },
  { id: 'JUNIOR2', name: 'JUNIOR 2', type: 'Standing', color: '#4e8ef7', price: 5000000 },
  { id: 'ELF1', name: 'E.L.F. 1', type: 'Seating', color: '#bfc2c7', price: 4000000 },
  { id: 'ELF2', name: 'E.L.F. 2', type: 'Seating', color: '#bfc2c7', price: 4000000 },
  { id: 'ELF3', name: 'E.L.F. 3', type: 'Seating', color: '#232b3b', price: 4000000 },
  { id: 'ELF4', name: 'E.L.F. 4', type: 'Seating', color: '#232b3b', price: 4000000 },
  { id: 'SAPPHIRE1', name: 'SAPPHIRE 1', type: 'Seating', color: '#bfeeea', price: 2800000 },
  { id: 'SAPPHIRE2', name: 'SAPPHIRE 2', type: 'Seating', color: '#bfeeea', price: 2800000 },
  { id: 'SAPPHIRE3', name: 'SAPPHIRE 3', type: 'Seating', color: '#bfeeea', price: 2800000 },
  { id: 'BLUE1', name: 'BLUE 1', type: 'Seating', color: '#bfe3fa', price: 2200000 },
  { id: 'BLUE2', name: 'BLUE 2', type: 'Seating', color: '#bfe3fa', price: 2200000 },
  { id: 'BLUE3', name: 'BLUE 3', type: 'Seating', color: '#bfe3fa', price: 2200000 },
];

// Mock seat data for demo
const generateSeats = (sectionId: string) => {
  // For demo, 5 rows x 10 seats
  return Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 10 }, (_, col) => ({
      id: `${sectionId}-R${row + 1}S${col + 1}`,
      row: row + 1,
      number: col + 1,
      status: Math.random() > 0.8 ? 'booked' : 'available',
    }))
  );
};

const Seat = ({ seat, onSelect, selected }: any) => (
  <button
    className={`w-7 h-7 m-1 rounded text-xs font-bold border
      ${seat.status === 'booked' ? 'bg-gray-400 cursor-not-allowed' : selected ? 'bg-green-400' : 'bg-white hover:bg-blue-200'}
    `}
    disabled={seat.status === 'booked'}
    onClick={() => onSelect(seat)}
  >
    {seat.number}
  </button>
);

const SectionBox = ({ section, onClick, selected }: any) => (
  <div
    className={`flex flex-col items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200
      ${selected ? 'ring-4 ring-green-400' : ''}
    `}
    style={{ background: section.color, width: 120, height: 70, margin: 8 }}
    onClick={() => onClick(section)}
  >
    <span className="text-white font-bold text-lg">{section.name}</span>
    <span className="text-white text-xs">{section.type}</span>
  </div>
);

const SeatMapDemo = () => {
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [seats, setSeats] = useState<any[][]>([]);

  const handleSectionClick = (section: any) => {
    setSelectedSection(section);
    setSeats(generateSeats(section.id));
    setSelectedSeats([]);
  };

  const handleSeatSelect = (seat: any) => {
    setSelectedSeats((prev) => {
      if (prev.some((s) => s.id === seat.id)) {
        return prev.filter((s) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  };

  return (
    <div className="flex w-full h-screen bg-black text-white">
      {/* Left: Seat map */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-2 text-green-400 text-sm font-semibold">Select section</div>
        <div className="mb-4 text-xs text-gray-300">Select a section to continue ticket selection</div>
        {/* Stage */}
        <div className="bg-gray-300 text-black font-bold text-3xl rounded-t-lg px-16 py-4 mb-4">STAGE</div>
        {/* Section layout (simplified for demo) */}
        <div className="flex flex-wrap justify-center max-w-3xl">
          {SECTIONS.map((section) => (
            <SectionBox
              key={section.id}
              section={section}
              onClick={handleSectionClick}
              selected={selectedSection?.id === section.id}
            />
          ))}
        </div>
        {/* Seat grid for selected section */}
        {selectedSection && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="mb-2 text-lg font-bold text-green-300">{selectedSection.name} - {selectedSection.type}</div>
            <div className="grid grid-rows-5 gap-2">
              {seats.map((row, i) => (
                <div key={i} className="flex">
                  {row.map((seat: any) => (
                    <Seat
                      key={seat.id}
                      seat={seat}
                      onSelect={handleSeatSelect}
                      selected={selectedSeats.some((s) => s.id === seat.id)}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm">Selected seats: {selectedSeats.map((s) => s.number).join(', ')}</div>
          </div>
        )}
      </div>
      {/* Right: Pricing */}
      <div className="w-96 bg-gray-900 p-6 flex flex-col">
        <div className="font-bold text-sm mb-2">SUPER JUNIOR 20th Anniversary TOUR in HO CHI MINH CITY</div>
        <div className="text-xs mb-2">Pricing</div>
        <div className="flex flex-col gap-1 mb-4">
          {SECTIONS.map((section) => (
            <div key={section.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-block w-5 h-3 rounded mr-2" style={{ background: section.color }}></span>
                <span className="text-xs">{section.name} ({section.type})</span>
              </div>
              <span className="text-green-400 text-xs font-bold">{section.price.toLocaleString()} đ</span>
            </div>
          ))}
        </div>
        <button className="mt-auto bg-gray-700 text-white py-2 rounded opacity-60 cursor-not-allowed" disabled>
          Please select ticket
        </button>
      </div>
    </div>
  );
};

export default SeatMapDemo;
