// Simulated API functions

interface BalanceData {
    totalAmount: string
    dueAmount: string
    dueDate: string
    status: string
  }
  
  // Mock data for different phone numbers
  const mockBalanceData: Record<string, BalanceData> = {
    "99410722": {
      totalAmount: "29.900",
      dueAmount: "29.900",
      dueDate: "2025/05/15",
      status: "غير مدفوع",
    },
    "99410222": {
      totalAmount: "15.500",
      dueAmount: "15.500",
      dueDate: "2025/05/10",
      status: "غير مدفوع",
    },
    "99999999": {
      totalAmount: "45.750",
      dueAmount: "0.000",
      dueDate: "2025/06/01",
      status: "مدفوع",
    },
  }
  
  export async function fetchBalance(phoneNumber: string): Promise<BalanceData> {
    // For development/testing, return mock data
    if (process.env.NODE_ENV === 'development' && mockBalanceData[phoneNumber]) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockBalanceData[phoneNumber];
    }
  
    // For production, make the actual API call
    const customerId = "564110"; // This would likely be dynamic or from auth
    const accessToken = localStorage.getItem('accessToken') || ''; // Get token from storage
    
    try {
      const response = await fetch(
        `https://myzain.kw.zain.com/api/customers/${customerId}/lines/${phoneNumber}/billing/balance/postpaid`,
        {
          method: 'GET',
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "ar",
            "Connection": "keep-alive",
            "Content-Type": "application/json; charset=utf-8",
            "Origin": "https://myzain.kw.zain.com",
            "Referer": "https://myzain.kw.zain.com/",
            "Authorization": `Bearer ${accessToken}`
          },
          credentials: 'include'
        }
      );
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  }