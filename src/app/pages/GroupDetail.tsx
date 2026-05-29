import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { DUMMY_GROUPS, STAGE_BADGE, type Group, type GroupStage } from "./GroupStats";

const STAGE_ORDER: GroupStage[] = ["모집 중", "내 책 읽기", "교환", "파트너 책 읽기", "반납", "종료"];

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showForceCloseDialog, setShowForceCloseDialog] = useState(false);
  const [group, setGroup] = useState<Group | null>(
    DUMMY_GROUPS.find((g) => g.id === Number(id)) ?? null
  );

  if (!group) {
    return (
      <div className="p-4 md:p-8">
        <button onClick={() => navigate("/group-stats")} className="flex items-center gap-2 text-[#5e5d5b] hover:text-[#242322] mb-4">
          <ArrowLeft className="w-4 h-4" />목록으로
        </button>
        <p className="text-[#858481]">그룹을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const currentStageIndex = STAGE_ORDER.indexOf(group.stage);
  const isTerminated = group.stage === "종료";

  const handleForceClose = () => {
    // TODO: API 연동 시 교체
    // await api.patch(`/api/admin/groups/${id}/force-close`);
    setGroup({ ...group, stage: "종료" });
    toast.success("그룹이 강제 종료되었습니다.");
    setShowForceCloseDialog(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/group-stats")}
          className="flex items-center gap-2 text-[#5e5d5b] hover:text-[#242322] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#242322]">{group.name}</h1>
            <p className="text-[#858481] mt-1 text-sm">생성일: {group.createdAt}</p>
          </div>
          {!isTerminated && (
            <button
              onClick={() => setShowForceCloseDialog(true)}
              className="px-5 py-2.5 rounded-[10px] border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              그룹 강제 종료
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* 진행 단계 스테퍼 */}
        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h2 className="text-base font-bold text-[#242322] mb-5">진행 단계</h2>
          <div className="flex items-center gap-0">
            {STAGE_ORDER.map((stage, i) => {
              const isDone = i < currentStageIndex;
              const isCurrent = i === currentStageIndex;
              const isLast = i === STAGE_ORDER.length - 1;
              return (
                <div key={stage} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCurrent ? "bg-[#ff7618] text-white ring-4 ring-[#ffe8d6]"
                      : isDone ? "bg-[#ff7618] text-white"
                      : "bg-[#f4f3f1] text-[#b0afad]"
                    }`}>
                      {isDone ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs mt-1.5 text-center leading-tight ${
                      isCurrent ? "font-semibold text-[#ff7618]"
                      : isDone ? "text-[#858481]"
                      : "text-[#b0afad]"
                    }`}>
                      {stage}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`h-0.5 w-full mx-1 mb-4 ${i < currentStageIndex ? "bg-[#ff7618]" : "bg-[#e2e1df]"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 그룹 정보 */}
        <div className="bg-white rounded-[20px] border border-[#e2e1df] p-6">
          <h2 className="text-base font-bold text-[#242322] mb-4">그룹 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="현재 단계">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STAGE_BADGE[group.stage]}`}>
                {group.stage}
              </span>
            </InfoRow>
            <InfoRow label="생성일" value={group.createdAt} />
            <InfoRow label="호스트 닉네임" value={group.hostNickname} />
            <InfoRow label="호스트 선정 책" value={group.hostBook} />
            <InfoRow label="게스트 닉네임" value={group.guestNickname} />
            <InfoRow label="게스트 선정 책" value={group.guestBook} />
          </div>
        </div>

        {/* 강제 종료 안내 (이미 종료된 경우) */}
        {isTerminated && (
          <div className="bg-[#f4f3f1] rounded-[20px] border border-[#e2e1df] p-6">
            <p className="text-sm text-[#858481]">이 그룹은 종료되었습니다.</p>
          </div>
        )}
      </div>

      <AlertDialog open={showForceCloseDialog} onOpenChange={setShowForceCloseDialog}>
        <AlertDialogContent className="bg-white rounded-[20px] border border-[#e2e1df]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#242322]">그룹 강제 종료</AlertDialogTitle>
            <AlertDialogDescription className="text-[#5e5d5b]">
              <span className="font-semibold text-[#242322]">"{group.name}"</span> 그룹을 강제 종료하시겠습니까?
              <br />
              종료 후에는 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#f4f3f1] text-[#242322] border-[#e2e1df] rounded-[10px] hover:bg-[#e2e1df]">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleForceClose}
              className="bg-red-500 text-white rounded-[10px] hover:bg-red-600"
            >
              강제 종료
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="bg-[#f4f3f1] rounded-[12px] p-4">
      <p className="text-xs text-[#858481] mb-1">{label}</p>
      {children ?? <p className="text-sm font-medium text-[#242322]">{value}</p>}
    </div>
  );
}
