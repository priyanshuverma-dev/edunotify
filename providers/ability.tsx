// "use client";

// import React, { createContext, useEffect, useMemo, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import {
//   AbilityBuilder,
//   AbilityTuple,
//   MongoAbility,
//   MongoQuery,
//   createMongoAbility,
// } from "@casl/ability";
// import { Permit, permitState } from "permit-fe-sdk";
// import { usePathname } from "next/navigation";

// interface AbilityContextProps {
//   ability: MongoAbility<AbilityTuple, MongoQuery> | undefined;
//   setAbility: React.Dispatch<
//     React.SetStateAction<MongoAbility<AbilityTuple, MongoQuery> | undefined>
//   >;
// }
// // Create Context
// export const AbilityContext = createContext<
//   MongoAbility<AbilityTuple, MongoQuery> | undefined
// >(undefined);

// export const getAbility = async (loggedInUser: string, tenant: string) => {
//   const permit = Permit({
//     loggedInUser: loggedInUser,
//     backendUrl: `/api/permissions`,
//     userAttributes: { tenant },
//   });

//   await permit.loadLocalStateBulk([
//     {
//       action: "update",
//       resource: "school",
//       userAttributes: { tenant },
//     },
//     {
//       action: "delete",
//       resource: "school",
//       userAttributes: { tenant },
//     },
//     {
//       action: "read",
//       resource: "school",
//       userAttributes: { tenant },
//     },
//     {
//       action: "update",
//       resource: "notice",
//       userAttributes: { tenant },
//     },
//     {
//       action: "delete",
//       resource: "notice",
//       userAttributes: { tenant },
//     },
//     {
//       action: "read",
//       resource: "notice",
//       userAttributes: { tenant },
//     },
//   ]);

//   const caslConfig = permitState.getCaslJson();

//   if (caslConfig && caslConfig.length) {
//     const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
//     caslConfig.forEach((rule) => {
//       can(rule.action, rule.subject);
//     });
//     return build();
//   } else {
//     return undefined;
//   }
// };

// export const AbilityLoader = ({
//   children,
//   schoolId,
// }: {
//   children: React.ReactNode;
//   schoolId: string;
// }) => {
//   const { isSignedIn, user } = useUser();

//   const [ability, setAbility] = useState<
//     MongoAbility<AbilityTuple, MongoQuery> | undefined
//   >(undefined);

//   useEffect(() => {
//     if (ability == undefined) {
//       getAbility(schoolId, schoolId).then((caslAbility) => {
//         setAbility(caslAbility);
//       });
//     }
//   }, [isSignedIn, user, schoolId]);

//   const abilityContextValue = useMemo(() => {
//     getAbility(schoolId, schoolId).then((caslAbility) => {
//       setAbility(caslAbility);
//     });
//     return ability;
//   }, [schoolId]);

//   console.log("ability", ability);

//   return (
//     <AbilityContext.Provider value={abilityContextValue}>
//       {!ability ? (
//         <div className="flex justify-center items-center">
//           Loading permissions...
//         </div>
//       ) : (
//         children
//       )}
//     </AbilityContext.Provider>
//   );
// };
