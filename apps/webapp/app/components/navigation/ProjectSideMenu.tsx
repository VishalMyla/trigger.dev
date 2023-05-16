import invariant from "tiny-invariant";
import { useCurrentJob } from "~/hooks/useJob";
import { useCurrentOrganization } from "~/hooks/useOrganizations";
import { useCurrentProject } from "~/hooks/useProject";
import { cn } from "~/utils/cn";
import {
  accountPath,
  organizationBillingPath,
  organizationTeamPath,
  projectEnvironmentsPath,
  projectIntegrationsPath,
  projectPath,
} from "~/utils/pathBuilder";
import { NavLinkButton } from "../primitives/Buttons";
import type { IconNames } from "../primitives/NamedIcon";
import { useMatches } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { SimpleTooltip } from "../primitives/Tooltip";

export function SideMenuContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full w-full">{children}</div>;
}

const menuVariants = {
  expanded: {
    width: "11rem",
  },
  collapsed: {
    width: "2.81rem",
  },
};

export function ProjectSideMenu() {
  const organization = useCurrentOrganization();
  const project = useCurrentProject();
  invariant(organization, "Organization must be defined");
  invariant(project, "Project must be defined");

  //we collapse the menu if we're in a job or an integration
  const job = useCurrentJob();
  // const isCollapsed = job !== undefined;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const jobsActive =
    job !== undefined ||
    useMatches().at(-1)?.id ===
      "routes/_app.orgs.$organizationSlug.projects.$projectParam._index";

  return (
    <motion.div
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={menuVariants}
      initial={isCollapsed ? "collapsed" : "expanded"}
      className={cn(
        "flex h-full flex-col justify-between border-r border-slate-850 p-1 transition duration-300 ease-in-out"
      )}
      onClick={() => setIsCollapsed((c) => !c)}
    >
      <div className="flex flex-col gap-1">
        <SideMenuItem
          name="Jobs"
          icon="job"
          to={projectPath(organization, project)}
          isCollapsed={isCollapsed}
          forceActive={jobsActive}
        />
        <SideMenuItem
          name="Integrations"
          icon="integration"
          to={projectIntegrationsPath(organization, project)}
          isCollapsed={isCollapsed}
        />
        <SideMenuItem
          name="Environments"
          icon="environment"
          to={projectEnvironmentsPath(organization, project)}
          isCollapsed={isCollapsed}
        />
      </div>
      <div className="flex flex-col">
        <SideMenuItem
          name="Team"
          icon="team"
          to={organizationTeamPath(organization)}
          isCollapsed={isCollapsed}
        />
        <SideMenuItem
          name="Billing"
          icon="billing"
          to={organizationBillingPath(organization)}
          isCollapsed={isCollapsed}
        />
        <SideMenuItem
          name="Account"
          icon="account"
          to={accountPath()}
          isCollapsed={isCollapsed}
        />
      </div>
    </motion.div>
  );
}

const itemVariants = {
  expanded: {
    opacity: 1,
  },
  collapsed: {
    opacity: 0,
  },
};

function SideMenuItem({
  icon,
  name,
  to,
  isCollapsed,
  forceActive,
}: {
  icon: IconNames;
  name: string;
  to: string;
  isCollapsed: boolean;
  forceActive?: boolean;
}) {
  return (
    <SimpleTooltip
      button={
        <NavLinkButton
          variant="menu-item"
          fullWidth
          textAlignLeft
          LeadingIcon={icon}
          leadingIconClassName="text-slate-400"
          to={to}
          className={({ isActive, isPending }) => {
            if (forceActive !== undefined) {
              isActive = forceActive;
            }
            return cn(
              isActive ? "bg-slate-750 group-hover:bg-slate-750" : undefined
            );
          }}
        >
          <motion.span
            className="pl-1"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={itemVariants}
            initial={isCollapsed ? "collapsed" : "expanded"}
          >
            {name}
          </motion.span>
        </NavLinkButton>
      }
      content={name}
      side="right"
      hidden={!isCollapsed}
    />
  );
}