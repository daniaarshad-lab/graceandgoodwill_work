"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  createEnquiry,
  fetchEnquiries,
  fetchEnquiryById,
  sendEnquiryMessage,
} from "@/store/slices/clientSlice";
import SectionCard from "../shared/SectionCard";
import EnquiryList from "./EnquiryList";
import EnquiryDetail from "./EnquiryDetail";
import NewEnquiryModal from "./NewEnquiryModal";
import EmptyEnquiryState from "./EmptyEnquiryState";
import { useAppDispatch } from "@/store/hooks";

export default function SupportEnquiryPanel() {
  const dispatch = useAppDispatch();

  const { enquiries, selectedEnquiry, profile } = useAppSelector(
    (state) => state.client,
  );
  const [showNewModal, setShowNewModal] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  useEffect(() => {
    dispatch(fetchEnquiries());
  }, [dispatch]);

  // Select an enquiry
  const handleSelect = async (enquiry: any) => {
    await dispatch(fetchEnquiryById(enquiry.id));
    setMobileView("detail");
  };

  // Go back to list on mobile
  const handleBack = () => {
    setMobileView("list");
  };

  const handleSendReply = async (enquiryId: string, message: string) => {
    try {
      await dispatch(sendEnquiryMessage({ enquiryId, message })).unwrap();
      // Refresh the specific enquiry to get new messages
      await dispatch(fetchEnquiryById(enquiryId));
      // Refresh the enquiry list to update timestamps and previews
      await dispatch(fetchEnquiries());
    } catch (error) {
      console.error("Failed to send reply", error);
    }
  };

  // Create a new enquiry
  const handleCreateEnquiry = async (data: { message: string }) => {
    try {
      await dispatch(
        createEnquiry({
          name:
            profile?.user?.firstName + " " + profile?.user?.lastName ||
            "Client",
          email: profile?.user?.email || "",
          phone: profile?.user?.phoneNumber || "",
          message: data.message,
        }),
      ).unwrap();

      setMobileView("list");
      setShowNewModal(false);
    } catch (error) {
      console.error("ENQUIRY ERROR", error);
    }
  };

  const hasEnquiries = enquiries.length > 0;

  return (
    <>
      {hasEnquiries ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-[calc(100vh-240px)] min-h-[600px]">
          {/* Left Panel — Enquiry List */}
          <div
            className={`md:col-span-2 min-h-0 flex flex-col ${
              mobileView === "detail" ? "hidden md:block" : "block"
            }`}
          >
            <SectionCard className="flex-1 flex flex-col overflow-hidden min-h-0">
              <EnquiryList
                enquiries={enquiries}
                selectedId={selectedEnquiry?.id ?? null}
                onSelect={handleSelect}
                onCreateNew={() => setShowNewModal(true)}
              />
            </SectionCard>
          </div>

          {/* Right Panel — Enquiry Detail & Conversation */}
          <div
            className={`md:col-span-3 min-h-0 flex flex-col ${
              mobileView === "list" ? "hidden md:block" : "block"
            }`}
          >
            <SectionCard className="flex-1 flex flex-col overflow-hidden min-h-0">
              <EnquiryDetail
                enquiry={selectedEnquiry}
                onSendReply={handleSendReply}
                onBack={handleBack}
                showBackButton={mobileView === "detail"}
              />
            </SectionCard>
          </div>
        </div>
      ) : (
        <SectionCard>
          <EmptyEnquiryState
            variant="no-enquiries"
            onCreateNew={() => setShowNewModal(true)}
          />
        </SectionCard>
      )}

      {/* New Enquiry Modal */}
      {showNewModal && (
        <NewEnquiryModal
          onClose={() => setShowNewModal(false)}
          onSubmit={handleCreateEnquiry}
        />
      )}
    </>
  );
}
