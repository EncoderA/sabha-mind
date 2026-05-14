// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { handleGoogleCallback } from "@/lib/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AudioLines } from "lucide-react";

// export default function GoogleCallbackPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
//   const [message, setMessage] = useState("Processing authentication...");

//   useEffect(() => {
//     const code = searchParams.get("code"); 
//     const error = searchParams.get("error");

//     if (error) {
//       setStatus("error");
//       setMessage("Authentication failed. Please try again.");
//       setTimeout(() => router.push("/login"), 3000);
//       return;
//     }

//     if (!code) {
//       setStatus("error");
//       setMessage("No authorization code received.");
//       setTimeout(() => router.push("/login"), 3000);
//       return;
//     }

//     // Exchange code for tokens
//     handleGoogleCallback(code)
//       .then((data) => {
//         if (data.accessToken) {
//           localStorage.setItem("accessToken", data.accessToken);
//           localStorage.setItem("refreshToken", data.refreshToken);
          
//           setStatus("success");
//           setMessage("Login successful! Redirecting...");
          
//           setTimeout(() => {
//             window.location.href = "/meet-addon/summaries";
//           }, 1500);
//         } else {
//           setStatus("error");
//           setMessage(data.error || "Authentication failed");
//           setTimeout(() => router.push("/login"), 3000);
//         }
//       })
//       .catch(() => {
//         setStatus("error");
//         setMessage("Something went wrong. Please try again.");
//         setTimeout(() => router.push("/login"), 3000);
//       });
//   }, [searchParams, router]);

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center px-4">
//       <Card className="w-full max-w-md shadow-2xl">
//         <CardHeader className="space-y-4">
//           <div className="flex justify-center">
//             <div className="bg-primary p-3 rounded-2xl">
//               <AudioLines className="text-primary-foreground size-7" />
//             </div>
//           </div>

//           <CardTitle className="text-2xl font-bold font-heading text-center">
//             {status === "loading" && "Authenticating..."}
//             {status === "success" && "Success!"}
//             {status === "error" && "Authentication Failed"}
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <div className="flex flex-col items-center gap-4">
//             {status === "loading" && (
//               <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//             )}
            
//             {status === "success" && (
//               <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
//                 <svg
//                   className="size-6 text-emerald-600 dark:text-emerald-400"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </div>
//             )}
            
//             {status === "error" && (
//               <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center">
//                 <svg
//                   className="size-6 text-destructive"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </div>
//             )}

//             <p className="text-center text-muted-foreground">{message}</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleGoogleCallback } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AudioLines } from "lucide-react";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      queueMicrotask(() => {
        setStatus("error");
        setMessage("Authentication failed. Please try again.");
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (!code) {
      queueMicrotask(() => {
        setStatus("error");
        setMessage("No authorization code received.");
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    handleGoogleCallback(code)
      .then((data) => {
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          setStatus("success");
          setMessage("Login successful! Redirecting...");

          setTimeout(() => {
            window.location.href = "/meet-addon/summaries";
          }, 1500);
        } else {
          setStatus("error");
          setMessage(data.error || "Authentication failed");
          setTimeout(() => router.push("/login"), 3000);
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
        setTimeout(() => router.push("/login"), 3000);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-2xl">
              <AudioLines className="text-primary-foreground size-7" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold font-heading text-center">
            {status === "loading" && "Authenticating..."}
            {status === "success" && "Success!"}
            {status === "error" && "Authentication Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            {status === "loading" && (
              <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            )}

            {status === "success" && (
              <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <svg
                  className="size-6 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}

            {status === "error" && (
              <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg
                  className="size-6 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}

            <p className="text-center text-muted-foreground">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
