import { seed } from "drizzle-seed";
import { db } from "./connection";
import { schema } from "./schema";

async function drizzleSeed() {
  await seed(db, schema).refine(f => ({
    organizations: {
      count: 5,
      columns: {
        name: f.companyName(),
      },
    },

    departments: {
      count: 10,
      columns: {
        name: f.loremIpsum(),
        organization_id: f.valuesFromArray({
          values: [1, 2, 3, 4, 5],
          isUnique: true
        }),
      },
    },

    addresses: {
      count: 20,
      columns: {
        cep: f.postcode(),
        street: f.streetAddress(),
        number: f.string({ arraySize: 1 }),
        neighborhood: f.loremIpsum(),
        city: f.city(),
        state: f.state(),
      },
    },

    employees: {
      count: 20,
      columns: {
        name: f.fullName(),
        birth_date: f.date({ minDate: new Date(1960, 0, 1), maxDate: new Date(2002, 0, 1) }),
        job_title: f.jobTitle(),
        organization_id: f.valuesFromArray({
          values: [1, 2, 3, 4, 5],
          isUnique: true
        }),
        department_id: f.valuesFromArray({
          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          isUnique: true
        }),
      },
    },

    users: {
      count: 10,
      columns: {
        name: f.fullName(),
        email: f.email(),
        password_hash: f.string({ arraySize: 60 }),
        role: f.valuesFromArray({ values: ["admin", "manager", "user"] }),
        organization_id: f.valuesFromArray({
          values: [1, 2, 3, 4, 5],
          isUnique: true
        }),
      },
    },

    gifts: {
      count: 30,
      columns: {
        gift_type: f.loremIpsum(),
        status: f.valuesFromArray({ values: ["pending", "sent", "delivered"] }),
        send_date: f.date({ minDate: new Date(2025, 0, 1), maxDate: new Date(2025, 11, 31) }),
        delivery_date: f.date({ minDate: new Date(2025, 0, 1), maxDate: new Date(2025, 11, 31) }),
        organization_id: f.valuesFromArray({
          values: [1, 2, 3, 4, 5],
          isUnique: true
        }),
        employee_id: f.valuesFromArray({
          values: [1, 2, 3, 4, 5],
          isUnique: true
        }),
      },
    },
  }))

  console.log("Seed completed"),
  process.exit()
}

drizzleSeed()