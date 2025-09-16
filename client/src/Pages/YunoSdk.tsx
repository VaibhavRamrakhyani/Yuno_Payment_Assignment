

// import React, { useCallback, useEffect, useState } from "react";
// import axios from "axios";
// import { loadScript } from "@yuno-payments/sdk-web";

// interface CardFormProps {
//   orderId?: string;
//   checkoutSessionId?: string;
//   countryCode?: 'US' | 'CO' | 'BR' | 'AR' | 'CL';
//   onSuccess?: (data: unknown) => void;
//   onError?: (error: Error) => void;
//   customerName?: string; // Corrected to a single prop for consistency
//   customerEmail?: string;
// }

// interface YunoInstance {
//   secureFields: (cfg: { countryCode: string; checkoutSession: string }) => Promise<SecureFieldInstance>;
// }

// interface SecureFieldInstance {
//   create: (
//     cfg: { name: 'pan' | 'expiration' | 'cvv'; options?: { label?: string; showError?: boolean } }
//   ) => { render: (selector: string) => void };
//   generateToken: (payload: {
//     cardHolderName: string;
//     customer?: {
//       name?: string;
//       email?: string;
//       document?: { document_number?: string; document_type?: string };
//     };
//   }) => Promise<{ token?: string; one_time_token?: string; oneTimeToken?: string }>;
// }

// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   interface Window { Yuno: any }
// }

// const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || "http://localhost:5000";

// // A mock implementation for getCountryData
// const getCountryData = (countryCode: string) => {
//   // In a real application, this would fetch specific document requirements
//   // for the country. For this fix, we'll use a placeholder.
//   return {
//     documentNumber: "123456789",
//     documentType: "CC"
//   };
// };

// const CardForm: React.FC<CardFormProps> = ({ orderId, checkoutSessionId, countryCode, onSuccess, onError, customerName, customerEmail,yunoCustomerId }) => {
//   const [yuno, setYuno] = useState<YunoInstance | null>(null);
//   const [secureFields, setSecureFields] = useState<SecureFieldInstance | null>(null);
//   const [customerSession, setCustomerSession] = useState<string | null>(checkoutSessionId || null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [sdkLoaded, setSdkLoaded] = useState(false);
//   const [secureReady, setSecureReady] = useState(false);

//   const [holder, setHolder] = useState("");

//   const initSdk = useCallback(async () => {
//     const publicKey = import.meta.env.VITE_YUNO_PUBLIC_KEY as string | undefined;
//     if (!publicKey) {
//       setError("Missing VITE_YUNO_PUBLIC_KEY env var");
//       return;
//     }
//     try {
//       setLoading(true);
//       await loadScript();
//       setSdkLoaded(true);
//       const yunoGlobal = window.Yuno as { initialize: (key: string) => Promise<unknown> };
//       const instance = (await yunoGlobal.initialize(publicKey)) as unknown as { secureFields: YunoInstance['secureFields'] };
//       setYuno(instance as YunoInstance);
//       setError(null);
//     } catch (e: unknown) {
//       setError("Failed to load/initialize Yuno SDK");
//       console.error("SDK init failure:", e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const onReady = () => setSdkLoaded(true);
//     const onErrorEvt = (evt: Event) => {
//       setSdkLoaded(false);
//       setError((evt as CustomEvent)?.detail?.message || "SDK load error");
//     };
//     window.addEventListener("yuno-sdk-ready", onReady as EventListener);
//     window.addEventListener("yuno-sdk-error", onErrorEvt as EventListener);
//     initSdk();
//     return () => {
//       window.removeEventListener("yuno-sdk-ready", onReady as EventListener);
//       window.removeEventListener("yuno-sdk-error", onErrorEvt as EventListener);
//     };
//   }, [initSdk]);

//   useEffect(() => {
//     if (checkoutSessionId) setCustomerSession(checkoutSessionId);
//   }, [checkoutSessionId]);

//   useEffect(() => {
//     const setupSecureFields = async () => {
//       if (!yuno || !customerSession) return;
//       try {
//         const cc = countryCode || 'US';
//         const instance = await yuno.secureFields({ countryCode: cc, checkoutSession: customerSession });
//         setSecureFields(instance);

//         const pan = instance.create({ name: 'pan', options: { label: 'Card Number', showError: true } });
//         const expiration = instance.create({ name: 'expiration', options: { label: 'MM/YY', showError: true } });
//         const cvvField = instance.create({ name: 'cvv', options: { label: 'CVV', showError: true } });

//         pan.render('#sf-pan');
//         expiration.render('#sf-expiration');
//         cvvField.render('#sf-cvv');
//         setSecureReady(true);
//       } catch (e) {
//         setError('Secure fields failed to initialize');
//         console.error('Secure fields init error:', e);
//       }
//     };
//     setupSecureFields();
//   }, [yuno, customerSession, countryCode]);
//  const handleSecureFieldsPay = async () => {
//   try {
//     if (!secureFields || !customerSession) {
//       setError("Secure fields not ready");
//       return;
//     }

//     if (!holder.trim()) {
//       setError("Enter cardholder name");
//       return;
//     }

//     // 🔑 Token generate using props
//     const tokenResp = await secureFields.generateToken({
//       cardHolderName: holder.trim(),
//       customer: {
//         id: yunoCustomerId,          // 👈 Prop from backend (Yuno Customer ID)
//         name: customerName?.trim(),  // 👈 Prop
//         email: customerEmail?.trim(),// 👈 Prop
//         document: {
//           document_number: "123456789", // 👈 Dummy for now, replace with actual user document
//           document_type: "CC"           // e.g., "CC", "PP"
//         }
//       }
//     });

//     console.log("Token Response:", tokenResp);

//     const oneTimeToken =
//       tokenResp?.one_time_token ||
//       tokenResp?.token ||
//       (typeof tokenResp === "string" ? tokenResp : null);

//     if (!oneTimeToken) {
//       throw new Error("Failed to generate one-time token");
//     }

//     // 🔑 Hit backend
//     const paymentResp = await axios.post(`${API_BASE}/api/payments/create-payment`, {
//       orderId,
//       customer_session: customerSession,
//       oneTimeToken,
//       yunoCustomerId, // bhej dena backend ko bhi
//     });

//     console.log("Payment response:", paymentResp.data);
//     onSuccess?.(paymentResp.data);

//   } catch (e: unknown) {
//     console.error("generateToken or create-payment error:", e);
//     const message = (e as { message?: string })?.message || "Payment error";
//     setError(message);
//     onError?.(new Error(message));
//   }
// };


// //   const handleSecureFieldsPay = async () => {
// //   try {
// //     if (!secureFields || !customerSession) {
// //       setError("Secure fields not ready");
// //       return;
// //     }

// //     if (!holder.trim()) {
// //       setError("Enter cardholder name");
// //       return;
// //     }

// //     // ✅ Generate token tied to your existing Yuno customer
// //     const tokenResp = await secureFields.generateToken({
// //       cardHolderName: holder.trim(),
// //       customer: {
// //         id: yunoCustomerId, // 🔑 REQUIRED to avoid INVALID_CUSTOMER_FOR_TOKEN
// //         name: customerName?.trim() || holder.trim(),
// //         email: customerEmail?.trim() || undefined,
// //         document: {
// //           document_number: "123456789", // Example only, should match real data
// //           document_type: "CC",          // Example: "CC" for Colombia, etc.
// //         },
// //       },
// //     });

// //     console.log("Token Response:", tokenResp);

// //     const oneTimeToken =
// //       tokenResp.one_time_token ||
// //       tokenResp.oneTimeToken ||
// //       tokenResp.token ||
// //       (typeof tokenResp === "string" ? tokenResp : null);

// //     if (!oneTimeToken) {
// //       throw new Error("Failed to generate one-time token");
// //     }

// //     // ✅ Now hit backend with token & customer session
// //     const paymentResp = await axios.post(`${API_BASE}/api/payments/create-payment`, {
// //       orderId,              // order from your app
// //       customer_session: customerSession, // comes from backend session
// //       oneTimeToken,         // token from Yuno SDK
// //       yunoCustomerId,       // tie it to the customer explicitly
// //     });

// //     console.log("Payment response:", paymentResp.data);
// //     onSuccess?.(paymentResp.data);

// //   } catch (e: unknown) {
// //     console.error("generateToken or create-payment error:", e);
// //     const message = (e as { message?: string })?.message || "Payment error";
// //     setError(message);
// //     onError?.(new Error(message));
// //   }
// // };

// // const handleSecureFieldsPay = async () => {
  
// //   try {
// //     if (!secureFields || !customerSession) {
// //       setError("Secure fields not ready");
// //       return;
// //     }

// //     if (!holder.trim()) {
// //       setError("Enter cardholder name");
// //       return;
// //     }

// //     // ✅ Use your existing yunoCustomerId
// //  const tokenResp = await secureFields.generateToken({
// //   // The cardholder's name, typically from an input field
// //   cardHolderName: holder.trim(),
  
// //   // The customer object, which must match the data
// //   // used to create the checkout session on your backend.
// //   customer: {
// //     name: customerName?.trim() || holder.trim(), // Use a provided name or fallback to the cardholder name
// //     email: customerEmail?.trim() || undefined, // Use a provided email
// //     document: {
// //       document_number: '123456789', // Example document number
// //       document_type: 'CC', // Example document type (e.g., CC for Colombia)
// //     },
// //   },
// // });
// //     console.log("Token Response:", tokenResp,yunoCustomerId);

// //     const oneTimeToken =
// //       tokenResp.one_time_token ||
// //       tokenResp.oneTimeToken ||
// //       tokenResp.token ||
// //       (typeof tokenResp === "string" ? tokenResp : null);

// //     if (!oneTimeToken) {
// //       throw new Error("Failed to generate one-time token");
// //     }

// //     // Now hit backend
// //     const paymentResp = await axios.post(
// //       `${API_BASE}/api/payments/create-payment`,
// //       {
// //         orderId,
// //         customer_session: customerSession,
// //         oneTimeToken,
// //       }
// //     );

// //     console.log("Payment response:", paymentResp.data);
// //     onSuccess?.(paymentResp.data);

// //   } catch (e: unknown) {
// //     console.error("generateToken or create-payment error:", e);
// //     const message = (e as { message?: string })?.message || "Payment error";
// //     setError(message);
// //     onError?.(new Error(message));
// //   }
// // };


//   // const handleSecureFieldsPay = async () => {
//   //   try {
//   //     if (!secureFields || !customerSession) {
//   //       setError("Secure fields not ready");
//   //       return;
//   //     }

//   //     if (!holder.trim()) {
//   //       setError("Enter cardholder name");
//   //       return;
//   //     }
      
//   //     const cd = getCountryData(countryCode || "US");

//   //     const tokenResp = await secureFields.generateToken({
//   //       cardHolderName: holder.trim(), // Use the name from the input field
//   //       customer: {
//   //         name: (customerName || holder).trim(), // Use the customerName prop if available, otherwise fall back to holder
//   //         email: (customerEmail || '').trim() || undefined,
//   //         document: {
//   //           document_number: cd.documentNumber,
//   //           document_type: cd.documentType
//   //         }
//   //       }
//   //     });

//   //     console.log("Token Response:", tokenResp);

//   //     const oneTimeToken =
//   //       tokenResp.one_time_token ||
//   //       tokenResp.oneTimeToken ||
//   //       tokenResp.token ||
//   //       (typeof tokenResp === "string" ? tokenResp : null);

//   //     if (!oneTimeToken) {
//   //       throw new Error("Failed to generate one-time token");
//   //     }

//   //     const paymentResp = await axios.post(`${API_BASE}/api/payments/create-payment`, {
//   //       orderId,
//   //       customer_session: customerSession,
//   //       oneTimeToken
//   //     });

//   //     console.log("Payment response:", paymentResp.data);
//   //     onSuccess?.(paymentResp.data);

//   //   } catch (e: unknown) {
//   //     console.error("generateToken or create-payment error:", e);
//   //     const message = (e as { message?: string })?.message || "Payment error";
//   //     setError(message);
//   //     onError?.(new Error(message));
//   //   }
//   // };

//   return (
//     <div>
//       {error && (
//         <div style={{ marginBottom: 12, color: "#b00020" }}>{error}</div>
//       )}

//       <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
//         <button type="button" disabled={loading} onClick={initSdk}>
//           {sdkLoaded ? "Reload SDK" : loading ? "Loading SDK..." : "Load SDK"}
//         </button>
//       </div>

//       <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
//         <div id="sf-pan" />
//         <div id="sf-expiration" />
//         <div id="sf-cvv" />
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
//           <input
//             placeholder="Cardholder Name"
//             value={holder}
//             onChange={(e) => setHolder(e.target.value)}
//           />
//           <button type="button" onClick={handleSecureFieldsPay} disabled={!secureReady}>
//             Pay
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardForm;



import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { loadScript } from "@yuno-payments/sdk-web";

interface CardFormProps {
  orderId?: string;
  checkoutSessionId?: string;
  countryCode?: 'US' | 'CO' | 'BR' | 'AR' | 'CL';
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  customerName?: string; // legacy support
  customerEmail?: string;
  // Extended props used by testPage
  customerFirstName?: string;
  customerLastName?: string;
  yunoCustomerId?: string;
  showMessage?: (message: string, type?: 'success' | 'error') => void;
  setShowCheckout?: (open: boolean) => void;
}

interface YunoInstance {
  secureFields: (cfg: { countryCode: string; checkoutSession: string }) => Promise<SecureFieldInstance>;
}

interface SecureFieldInstance {
  create: (
    cfg: { name: 'pan' | 'expiration' | 'cvv'; options?: { label?: string; showError?: boolean } }
  ) => { render: (selector: string) => void };
  generateToken: (payload: {
    cardHolderName: string;
    customer?: {
      name?: string;
      email?: string;
      document?: { document_number?: string; document_type?: string };
    };
  }) => Promise<{ token?: string; one_time_token?: string; oneTimeToken?: string }>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { Yuno: any }
}

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || "http://localhost:5000";

// A mock implementation for getCountryData

const getCountryData = (countryCode: string) => {

  return {
    documentNumber: "123456789",
    documentType: "CC"
  };
};

const CardForm: React.FC<CardFormProps> = ({ orderId, checkoutSessionId, countryCode, showMessage, onSuccess, onError, customerFirstName, customerLastName, customerEmail, yunoCustomerId, setShowCheckout }) => {
  const [yuno, setYuno] = useState<YunoInstance | null>(null);
  const [secureFields, setSecureFields] = useState<SecureFieldInstance | null>(null);
  const [customerSession, setCustomerSession] = useState<string | null>(checkoutSessionId || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [secureReady, setSecureReady] = useState(false);

  const [holder, setHolder] = useState("");
  console.log(customerFirstName,customerLastName,customerEmail,yunoCustomerId,"PAYLOAD in SDK")
  const initSdk = useCallback(async () => {
    const publicKey = import.meta.env.VITE_YUNO_PUBLIC_KEY as string | undefined;
    if (!publicKey) {
      setError("Missing VITE_YUNO_PUBLIC_KEY env var");
      return;
    }
    try {
      setLoading(true);
      await loadScript();
      setSdkLoaded(true);
      const yunoGlobal = window.Yuno as { initialize: (key: string) => Promise<unknown> };
      const instance = (await yunoGlobal.initialize(publicKey)) as unknown as { secureFields: YunoInstance['secureFields'] };
      setYuno(instance as YunoInstance);
      setError(null);
    } catch (e: unknown) {
      setError("Failed to load/initialize Yuno SDK");
      console.error("SDK init failure:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const onReady = () => setSdkLoaded(true);
    const onErrorEvt = (evt: Event) => {
      setSdkLoaded(false);
      setError((evt as CustomEvent)?.detail?.message || "SDK load error");
    };
    window.addEventListener("yuno-sdk-ready", onReady as EventListener);
    window.addEventListener("yuno-sdk-error", onErrorEvt as EventListener);
    initSdk();
    return () => {
      window.removeEventListener("yuno-sdk-ready", onReady as EventListener);
      window.removeEventListener("yuno-sdk-error", onErrorEvt as EventListener);
    };
  }, [initSdk]);

  useEffect(() => {
    if (checkoutSessionId) setCustomerSession(checkoutSessionId);
  }, [checkoutSessionId]);

  useEffect(() => {
    const setupSecureFields = async () => {
      if (!yuno || !customerSession) return;
      try {
        const cc = countryCode || 'US';
        const instance = await yuno.secureFields({ countryCode: cc, checkoutSession: customerSession });
        setSecureFields(instance);

        const pan = instance.create({ name: 'pan', options: { label: 'Card Number', showError: true } });
        const expiration = instance.create({ name: 'expiration', options: { label: 'MM/YY', showError: true } });
        const cvvField = instance.create({ name: 'cvv', options: { label: 'CVV', showError: true } });

        pan.render('#sf-pan');
        expiration.render('#sf-expiration');
        cvvField.render('#sf-cvv');
        setSecureReady(true);
      } catch (e) {
        setError('Secure fields failed to initialize');
        console.error('Secure fields init error:', e);
      }
    };
    setupSecureFields();
  }, [yuno, customerSession, countryCode]);
 const handleSecureFieldsPay = async () => {
  try {
    if (!secureFields || !customerSession) {
      setError("Secure fields not ready");
      return;
    }

    if (!holder.trim()) {
      setError("Enter cardholder name");
      return;
    }

    // 🔑 Token generate using props
    const tokenResp = await secureFields.generateToken({
      cardHolderName: holder.trim(),
      customer: {
        id: yunoCustomerId,          
        name: customerFirstName?.trim(),  // 👈 Prop
        email: customerEmail?.trim(),// 👈 Prop
        document: {
          document_number: "123456789", 
          document_type: "CC"           
        }
      }
    });

    console.log("Token Response:", tokenResp);

    const oneTimeToken =
      tokenResp?.one_time_token ||
      tokenResp?.token ||
      (typeof tokenResp === "string" ? tokenResp : null);

    if (!oneTimeToken) {
      throw new Error("Failed to generate one-time token");
    }

    // 🔑 Hit backend
    const paymentResp = await axios.post(`${API_BASE}/api/payments/create-payment`, {
      orderId,
      customer_session: customerSession,
      oneTimeToken,
      yunoCustomerId, // bhej dena backend ko bhi
    });

    console.log("Payment response:", paymentResp.data);
    onSuccess?.(paymentResp.data);
    if(paymentResp.data.status === "SUCCEEDED"){
      setShowCheckout(false);
      showMessage( 'Payment Success', 'success')
    }


  } catch (e: unknown) {
    console.error("generateToken or create-payment error:", e);
    const message = (e as { message?: string })?.message || "Payment error";
    setError(message);
    onError?.(new Error(message));
  }
};

  return (
    <div>
      {/* {error && (
        <div style={{ marginBottom: 12, color: "#b00020" }}>{error}</div>
      )} */}

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <button type="button" disabled={loading} onClick={initSdk}>
          {sdkLoaded ? "Reload SDK" : loading ? "Loading SDK..." : "Load SDK"}
        </button>
      </div>

      <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <div id="sf-pan" />
        <div id="sf-expiration" />
        <div id="sf-cvv" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
          <input
            placeholder="Cardholder Name"
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
          />
          <button type="button" onClick={handleSecureFieldsPay} disabled={!secureReady}>
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardForm;
