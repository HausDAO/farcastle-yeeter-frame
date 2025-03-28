import { useDaoMembers } from "@/hooks/useDaoMembers";
import { useYeeter } from "../hooks/useYeeter";
import { ProjectAddressListItem } from "./app/ProjectAddressListItem";

export const ProjectTeamList = ({
  chainid,
  daoid,
  yeeterid,
}: {
  chainid?: string;
  daoid: string;
  yeeterid: string;
}) => {
  const { yeeter } = useYeeter({
    chainid,
    yeeterid,
  });
  const { members } = useDaoMembers({
    chainid,
    daoid,
  });
  if (!yeeter || !chainid) return;

  return (
    <div>
      {members &&
        members.map((member) => {
          return (
            <ProjectAddressListItem
              memberAddress={member.memberAddress}
              key={member.id}
            />
          );
        })}
    </div>
  );
};
