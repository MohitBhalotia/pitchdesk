export const dummyData = {
    residents: [
      {
        residentId: "RES-CBG-1001",
        fullName: "Mohit",
        DOB: "2004-04-20",
        role: "Owner",
        unitNumber: "Unit 101",
        phone: "+1-614-555-1101",
        email: "bt23cse181@iiitn.ac.in",
        preferredLanguage: "en",
        accountStatus: "active",
        extras: {
          zipCode: "43215",
          lastPaymentAmount: 450.0
        },
        documents: [
          {
            documentId: "DOC-CBG-101",
            type: "Lease Agreement",
            title: "Casabella Gold Lease Agreement",
            url: "https://www.orimi.com/pdf-test.pdf"
          },
          {
            documentId: "DOC-CBG-102",
            type: "Account Statement",
            title: "January 2026 Account Statement",
            url: "https://file-examples.com/storage/fe6c1c6c5f4d6e2e9d4b2a1/2017/10/file-example_PDF_500_kB.pdf"
          }
        ]
      },
      {
        residentId: "RES-CBG-1002",
        fullName: "Yogesh",
        DOB: "2003-09-25",
        role: "Tenant",
        unitNumber: "Unit 102",
        phone: "+1-614-555-1102",
        email: "mohitkumarbhalotia420@gmail.com",
        preferredLanguage: "en",
        accountStatus: "active",
        extras: {
          zipCode: "43215",
          lastPaymentAmount: 0.0
        },
        documents: [
          {
            documentId: "DOC-CBG-201",
            type: "Lease Agreement",
            title: "Casabella Gold Lease Agreement",
            url: "https://www.orimi.com/pdf-test.pdf"
          },
          {
            documentId: "DOC-CBG-202",
            type: "Account Statement",
            title: "January 2026 Account Statement",
            url: "https://file-examples.com/storage/fe6c1c6c5f4d6e2e9d4b2a1/2017/10/file-example_PDF_500_kB.pdf"
          }
        ]
      },
      {
        residentId: "RES-CBG-1003",
        fullName: "Rahul",
        DOB: "2004-04-20",
        role: "Owner",
        unitNumber: "Unit 201",
        phone: "+1-614-555-1103",
        email: "rahul@quickscribe.co",
        preferredLanguage: "en",
        accountStatus: "past_due",
        extras: {
          zipCode: "43215",
          lastPaymentAmount: 380.0
        },
        documents: [
          {
            documentId: "DOC-CBG-301",
            type: "Lease Agreement",
            title: "Casabella Gold Lease Agreement",
            url: "https://www.orimi.com/pdf-test.pdf"
          },
          {
            documentId: "DOC-CBG-302",
            type: "Account Statement",
            title: "January 2026 Account Statement",
            url: "https://file-examples.com/storage/fe6c1c6c5f4d6e2e9d4b2a1/2017/10/file-example_PDF_500_kB.pdf"
          }
        ]
      }
    ],
  
    issues: [
      {
        issueId: "ISS-CBG-9001",
        residentId: "RES-CBG-1001",
        unitNumber: "Unit 101",
        category: "Maintenance",
        subCategory: "Plumbing",
        description: "Water leaking under the kitchen sink",
        priority: "normal",
        status: "in_progress",
        createdAt: "2026-01-12T10:30:00Z",
        assignedTo: "ABC Plumbing Services",
        expectedResolution: "2026-01-15"
      },
      {
        issueId: "ISS-CBG-9002",
        residentId: "RES-CBG-1001",
        unitNumber: "Unit 101",
        category: "Complaint",
        subCategory: "Noise",
        description: "Loud noise from adjacent unit after 11 PM",
        priority: "low",
        status: "open",
        createdAt: "2026-01-10T23:45:00Z"
      },
      {
        issueId: "ISS-CBG-9003",
        residentId: "RES-CBG-1002",
        unitNumber: "Unit 102",
        category: "Maintenance",
        subCategory: "Electrical",
        description: "Bedroom power outlet not working",
        priority: "normal",
        status: "open",
        createdAt: "2026-01-13T09:15:00Z"
      },
      {
        issueId: "ISS-CBG-9004",
        residentId: "RES-CBG-1003",
        unitNumber: "Unit 201",
        category: "Billing",
        subCategory: "Outstanding Dues",
        description: "Resident has an overdue HOA balance",
        priority: "high",
        status: "open",
        createdAt: "2026-01-05T08:00:00Z",
        amountDue: 125.0,
        dueDate: "2026-01-20"
      },
      {
        issueId: "ISS-CBG-9005",
        residentId: "RES-CBG-1003",
        unitNumber: "Unit 201",
        category: "Violation",
        subCategory: "Parking",
        description: "Vehicle parked overnight in guest parking",
        priority: "medium",
        status: "open",
        createdAt: "2026-01-11T07:20:00Z",
        fineAmount: 50.0,
        complianceDeadline: "2026-01-18"
      }
    ]
  };
  