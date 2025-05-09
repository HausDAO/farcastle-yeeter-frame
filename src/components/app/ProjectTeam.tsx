import { useDaoMembers } from "@/hooks/useDaoMembers";
import { useYeeter } from "../../hooks/useYeeter";
import { ProjectAddressListItem } from "./ProjectAddressListItem";

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
  const { members, farcasterUsers } = useDaoMembers({
    chainid,
    daoid,
  });
  if (!yeeter || !chainid) return;

  console.log("farcasterUsers", farcasterUsers);

  return (
    <div className="flex flex-col gap-4">
      {members &&
        members.map((member) => {
          return (
            <ProjectAddressListItem
              memberAddress={member.memberAddress}
              farcasterUsers={farcasterUsers?.[member.memberAddress]}
              key={member.id}
            />
          );
        })}
    </div>
  );
};
