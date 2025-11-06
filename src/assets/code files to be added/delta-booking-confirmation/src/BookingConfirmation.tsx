import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Download } from "lucide-react";
import jsPDF from "jspdf";

const COMPANY = "Delta Hotel Booking";
const BOOKING_ID = "5667465646646564";
const AMOUNT = "R3,600";
const EMAIL = "michael@gmail.com";

export default function BookingConfirmation() {
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsRedirecting(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  function downloadReceipt() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const pageWidth = 595; // approx A4 width in pt
    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(COMPANY, margin, 70);

    // Small company placeholder rectangle (logo area)
    doc.setDrawColor(200);
    doc.rect(pageWidth - margin - 80, 40, 60, 30);
    doc.setFontSize(10);
    doc.text("Logo", pageWidth - margin - 60, 60);

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Receipt", margin, 120);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const now = new Date();
    doc.text(`Date: ${now.toLocaleString()}`, margin, 145);

    // Booking details box
    doc.setDrawColor(230);
    doc.rect(margin, 160, pageWidth - margin*2, 120, "S");
    doc.text(`Booking ID: ${BOOKING_ID}`, margin + 10, 185);
    doc.text(`Customer Email: ${EMAIL}`, margin + 10, 205);
    doc.text(`Amount Paid: ${AMOUNT}`, margin + 10, 225);
    doc.text(`Payment Method: Visa **** 4432`, margin + 10, 245);

    // Amount on right
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${AMOUNT}`, pageWidth - margin - 100, 200);

    // Divider
    doc.setDrawColor(200);
    doc.line(margin, 300, pageWidth - margin, 300);

    // Footer / Thank you
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for choosing " + COMPANY + ".", margin, 340);
    doc.text("If you have questions, contact support at support@deltahotel.example", margin, 360);

    // Signature line
    doc.line(pageWidth - margin - 200, 420, pageWidth - margin, 420);
    doc.text("Authorized Signature", pageWidth - margin - 185, 435);

    // Save PDF
    doc.save(`receipt-${BOOKING_ID}.pdf`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <header className="fixed top-4 left-0 right-0 flex items-center justify-between px-6 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-sm">
            <span className="font-semibold text-gray-800">{COMPANY}</span>
          </div>
        </div>
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="text-right mr-2 hidden sm:block">
            <div className="text-sm text-gray-600">{EMAIL}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium shadow-sm">
            M
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen px-4">
        <AnimatePresence mode="wait">
          {isRedirecting ? (
            <motion.div
              key="redirecting"
              className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-4 mb-4">
                  <CheckCircle className="text-green-600 w-16 h-16" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                  Payment Successful
                </h1>
                <p className="text-gray-600">Redirecting to booking confirmation...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed"
              className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ rotate: -20, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-green-100 rounded-full p-5 mb-4"
                >
                  <CheckCircle className="text-green-600 w-16 h-16" />
                </motion.div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
                  Booking Confirmed
                </h1>
                <p className="text-gray-700 mb-2 font-medium">
                  ID#<span className="font-mono text-gray-800">{BOOKING_ID}</span>
                </p>
                <p className="text-gray-600 mb-8">
                  A confirmation email will be sent to your email shortly.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition font-medium"
                    onClick={downloadReceipt}
                  >
                    <Download className="w-5 h-5" />
                    Download Receipt
                  </motion.button>

                  <a href="/home" className="text-gray-600 hover:text-gray-800 underline ml-1">Go back home</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
