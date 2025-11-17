import React, { useState } from "react";
import {
  FileText,
  Search,
  AlertTriangle,
  Calculator,
  Download,
  Bot,
  DollarSign,
} from "lucide-react";

interface Employee {
  id: number;
  name: string;
  department: string;
  grade: string;
  baseSalary: number;
  performanceBonus: number;
  deductions: number;
  attendance: number; // %
  leavesTaken: number;
}

interface Payslip {
  employeeId: number;
  gross: number;
  tax: number;
  net: number;
}

interface PayrollAlert {
  employeeId: number;
  message: string;
}

// ======= Demo Data =======
const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Aditi Sharma",
    department: "Software Engineering",
    grade: "G7",
    baseSalary: 85000,
    performanceBonus: 5000,
    deductions: 2500,
    attendance: 96,
    leavesTaken: 2,
  },
  {
    id: 2,
    name: "Rohit Verma",
    department: "Data Science",
    grade: "Intern",
    baseSalary: 25000,
    performanceBonus: 1500,
    deductions: 500,
    attendance: 90,
    leavesTaken: 3,
  },
  {
    id: 3,
    name: "Megha Singh",
    department: "Marketing",
    grade: "G6",
    baseSalary: 72000,
    performanceBonus: 3000,
    deductions: 2000,
    attendance: 98,
    leavesTaken: 1,
  },
];

// ====================================================
// Helper Functions
// ====================================================
const calculatePayslip = (emp: Employee): Payslip => {
  const gross = emp.baseSalary + emp.performanceBonus;
  const tax = gross * 0.1; // 10% tax
  const net = gross - tax - emp.deductions;
  return { employeeId: emp.id, gross, tax, net };
};

const detectAnomaly = (emp: Employee, payslip: Payslip): string | null => {
  if (emp.attendance < 85) return "Low attendance may affect pay.";
  if (payslip.net < 0) return "Negative net pay detected.";
  if (emp.leavesTaken > 5) return "Excessive leaves recorded.";
  return null;
};

// ====================================================
// REGULAR PAYROLL VIEW (Employee-side)
// ====================================================
const Payroll = () => {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-transparent p-6 text-left">
      {!selectedEmployee ? (
        <div className="space-y-4">
          {employees.map((emp) => {
            const payslip = calculatePayslip(emp);
            return (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">{emp.department}</p>
                    <h3 className="text-[16px] font-medium text-gray-900">
                      {emp.name}
                    </h3>
                    <p className="text-sm text-gray-600">Grade: {emp.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">
                      Net Pay:{" "}
                      <span className="font-medium text-green-600">
                        ₹{payslip.net.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-md">
          <button
            onClick={() => setSelectedEmployee(null)}
            className="text-sm text-blue-600 hover:underline mb-4"
          >
            ← Back to all employees
          </button>

          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {selectedEmployee.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {selectedEmployee.department} • Grade: {selectedEmployee.grade}
          </p>

          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p>Base Salary: ₹{selectedEmployee.baseSalary.toLocaleString()}</p>
            <p>Performance Bonus: ₹{selectedEmployee.performanceBonus}</p>
            <p>Deductions: ₹{selectedEmployee.deductions}</p>
            <p>Attendance: {selectedEmployee.attendance}%</p>
            <p>Leaves Taken: {selectedEmployee.leavesTaken}</p>
          </div>

          <div className="mt-5 border-t pt-4">
            <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-blue-600" /> Payslip
            </h4>
            {(() => {
              const payslip = calculatePayslip(selectedEmployee);
              return (
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Gross Pay: ₹{payslip.gross.toLocaleString()}</p>
                  <p>Tax (10%): ₹{payslip.tax.toLocaleString()}</p>
                  <p className="font-semibold text-green-700">
                    Net Pay: ₹{payslip.net.toLocaleString()}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

// ====================================================
// EXPANDED PAYROLL VIEW (Admin-side)
// ====================================================
const Payroll_Expanded = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [alerts, setAlerts] = useState<PayrollAlert[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const generateAlerts = () => {
    const newAlerts: PayrollAlert[] = [];
    employees.forEach((emp) => {
      const payslip = calculatePayslip(emp);
      const anomaly = detectAnomaly(emp, payslip);
      if (anomaly) newAlerts.push({ employeeId: emp.id, message: anomaly });
    });
    setAlerts(newAlerts);
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-[IBM Plex Sans] w-full h-full overflow-y-auto bg-white border border-gray-300 p-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-gray-900">
            Payroll Management
          </h2>
          <p className="text-gray-700 text-sm">
            Calculate salaries, generate payslips, and flag payroll anomalies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={generateAlerts}
            className="flex items-center gap-2 px-4 py-2 bg-[#0565FF] text-white text-sm hover:bg-[#0453d9] transition-all"
          >
            <AlertTriangle size={16} /> Check Anomalies
          </button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-6 border border-yellow-200 bg-yellow-50 p-4 rounded-md">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <AlertTriangle size={16} /> Payroll Anomalies
          </h4>
          <ul className="list-disc ml-6 text-sm text-yellow-800 space-y-1">
            {alerts.map((a) => {
              const emp = employees.find((e) => e.id === a.employeeId);
              return (
                <li key={a.employeeId}>
                  <strong>{emp?.name}</strong>: {a.message}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Employee Details View */}
      {selectedEmployee ? (
        <div className="mt-6 border border-gray-200 p-6 rounded-md shadow-sm">
          <button
            onClick={() => setSelectedEmployee(null)}
            className="text-sm text-blue-600 hover:underline mb-4"
          >
            ← Back to all employees
          </button>

          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {selectedEmployee.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {selectedEmployee.department} • Grade: {selectedEmployee.grade}
          </p>

          <div className="mt-3 text-sm text-gray-700 space-y-1">
            <p>Base Salary: ₹{selectedEmployee.baseSalary.toLocaleString()}</p>
            <p>Bonus: ₹{selectedEmployee.performanceBonus}</p>
            <p>Deductions: ₹{selectedEmployee.deductions}</p>
            <p>Attendance: {selectedEmployee.attendance}%</p>
            <p>Leaves: {selectedEmployee.leavesTaken}</p>
          </div>

          <div className="mt-5 border-t pt-4">
            <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calculator size={16} className="text-blue-600" /> Payroll
              Calculation
            </h4>
            {(() => {
              const payslip = calculatePayslip(selectedEmployee);
              return (
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Gross Pay: ₹{payslip.gross.toLocaleString()}</p>
                  <p>Tax (10%): ₹{payslip.tax.toLocaleString()}</p>
                  <p className="font-semibold text-green-700">
                    Net Pay: ₹{payslip.net.toLocaleString()}
                  </p>
                </div>
              );
            })()}
          </div>

          <div className="mt-5 flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm transition">
              <Download size={14} /> Generate Payslip
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 text-sm transition">
              <Bot size={14} /> Ask Payroll Assistant
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEmployees.map((emp) => {
            const payslip = calculatePayslip(emp);
            return (
              <div
                key={emp.id}
                className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">{emp.department}</p>
                    <h3 className="text-[16px] font-medium text-gray-900">
                      {emp.name}
                    </h3>
                    <p className="text-sm text-gray-600">Grade: {emp.grade}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-700">
                      Net Pay:{" "}
                      <span className="font-medium text-green-600">
                        ₹{payslip.net.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-right">
                  <button
                    onClick={() => setSelectedEmployee(emp)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Export both
export default Payroll;
export { Payroll_Expanded };
