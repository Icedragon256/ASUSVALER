import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, Clock, ImageOff, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Submission {
  id: string;
  amount: number;
  network: string;
  screenshot_url: string | null;
  status: string;
  notes: string | null;
  submitted_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',   color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  confirmed: { label: 'Confirmed', color: 'text-[#00BF9A]',  bg: 'bg-[#00BF9A]/10 border-[#00BF9A]/30' },
  rejected:  { label: 'Rejected',  color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/30' },
};

const NETWORK_COLOR: Record<string, string> = { mtn: '#FFCC00', airtel: '#FF0000' };

interface PaymentsAdminProps {
  onBack: () => void;
  onApprove: (amount: number) => void;
}

export default function PaymentsAdmin({ onBack, onApprove }: PaymentsAdminProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('payment_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });
    setSubmissions(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('payment_submissions')
      .update({ status })
      .eq('id', id);
    if (!error) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      if (status === 'confirmed') {
        const submission = submissions.find(s => s.id === id);
        if (submission) onApprove(submission.amount);
      }
    }
    setUpdatingId(null);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-UG', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-black max-w-[450px] mx-auto">
      {/* Nav */}
      <div className="w-full sticky top-0 z-10 bg-[#191B1F]">
        <div className="flex items-center h-[46px] px-4">
          <button onClick={onBack} className="mr-auto">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-[16px]">
            Payment Submissions
          </span>
          <button onClick={load} className="ml-auto" disabled={loading}>
            <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-[#1E2024] px-4 py-3 flex items-center gap-4 mt-[10px]">
        <div className="flex-1 text-center">
          <p className="text-[#888] text-[11px]">Total</p>
          <p className="text-white text-[18px] font-semibold">{submissions.length}</p>
        </div>
        <div className="w-px h-8 bg-[#333]" />
        <div className="flex-1 text-center">
          <p className="text-[#888] text-[11px]">Pending</p>
          <p className="text-yellow-400 text-[18px] font-semibold">{pendingCount}</p>
        </div>
        <div className="w-px h-8 bg-[#333]" />
        <div className="flex-1 text-center">
          <p className="text-[#888] text-[11px]">Confirmed</p>
          <p className="text-[#00BF9A] text-[18px] font-semibold">
            {submissions.filter(s => s.status === 'confirmed').length}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-3 py-3 space-y-3">
        {loading && submissions.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-[#444] animate-spin" />
          </div>
        )}

        {!loading && submissions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Clock className="w-10 h-10 text-[#444]" />
            <p className="text-[#666] text-[14px]">No submissions yet</p>
          </div>
        )}

        {submissions.map((s) => {
          const statusCfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.pending;
          const isUpdating = updatingId === s.id;

          return (
            <div key={s.id} className="bg-[#1E2024] rounded-sm overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: NETWORK_COLOR[s.network] ?? '#888' }}
                  />
                  <span className="text-[#aaa] text-[12px] uppercase tracking-wide">{s.network}</span>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${statusCfg.color} ${statusCfg.bg}`}>
                  {statusCfg.label}
                </span>
              </div>

              <div className="px-4 pb-3">
                <p className="text-white text-[22px] font-semibold">
                  UGX {s.amount.toLocaleString()}
                </p>
                <p className="text-[#666] text-[11px] mt-0.5">{formatDate(s.submitted_at)}</p>
              </div>

              {/* Screenshot */}
              {s.screenshot_url ? (
                <button
                  className="w-full px-4 pb-3"
                  onClick={() => setPreviewUrl(s.screenshot_url)}
                >
                  <div className="relative w-full h-36 rounded overflow-hidden border border-[#333] group">
                    <img
                      src={s.screenshot_url}
                      alt="Payment screenshot"
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <span className="text-white text-[12px] font-medium bg-black/60 px-2 py-1 rounded">
                        View Full
                      </span>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="mx-4 mb-3 h-10 border border-dashed border-[#333] flex items-center justify-center gap-2 rounded">
                  <ImageOff className="w-4 h-4 text-[#555]" />
                  <span className="text-[#555] text-[12px]">No screenshot uploaded</span>
                </div>
              )}

              {/* Action Buttons */}
              {s.status !== 'confirmed' && s.status !== 'rejected' && (
                <div className="flex gap-2 px-4 pb-4">
                  <button
                    disabled={isUpdating}
                    onClick={() => updateStatus(s.id, 'confirmed')}
                    className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-[#00BF9A]/10 border border-[#00BF9A]/40 text-[#00BF9A] text-[13px] font-medium rounded hover:bg-[#00BF9A]/20 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => updateStatus(s.id, 'rejected')}
                    className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[13px] font-medium rounded hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}

              {s.status === 'confirmed' && (
                <div className="px-4 pb-4 flex justify-end">
                  <button
                    disabled={isUpdating}
                    onClick={() => updateStatus(s.id, 'pending')}
                    className="text-[11px] text-[#555] hover:text-[#888] transition-colors"
                  >
                    Undo
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Screenshot Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            className="absolute top-4 right-4 bg-white/10 rounded-full p-2"
            onClick={() => setPreviewUrl(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <img
            src={previewUrl}
            alt="Payment proof"
            className="max-w-full max-h-full object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
