import type {PageServerLoad, Actions} from "./$types";
import {
    loadPatients,
    insertPatient,
    updatePatient,
    checkAccess
} from "$lib/util";

//When the broswer loads the viewPatients page this function is called ad returns all patients in the database
export const load: PageServerLoad = async ({locals}) => {
    checkAccess(locals.user?.type);
    const patients = await loadPatients(locals.db as D1Database);
    return {
        patients: patients
    };
};

/*This is the default form submission function. 
The function allows for the creation and editting of a patient, 
which both have the same form inputs in two different spots on the page
*/
export const actions: Actions = {
    default: async ({request, locals}) => {
        checkAccess(locals.user?.type);
        const data = await request.formData();
        const stringId = data.get("id") as string;
        const firstName = data.get("firstName") as string;
        const lastName = data.get("lastName") as string;
        const dateOfBirth = data.get("dateOfBirth") as string; // Use appropriate type based on your needs
        const email = data.get("email") as string;
        const phone = data.get("phone") as string;
        let address = data.get("address") as string;
        const insurance = data.get("insurance") === "on"; // Check if checkbox is checked

        const errors: {[key: string]: string} = {}; // Object to hold error messages

        const id = parseInt(stringId);
        // First Name validation
        if (!firstName) {
            errors.firstName = "Missing First Name";
        } else if (typeof firstName !== "string") {
            errors.firstName = "Invalid First Name";
        }

        // Last Name validation
        if (!lastName) {
            errors.lastName = "Missing Last Name";
        } else if (typeof lastName !== "string") {
            errors.lastName = "Invalid Last Name";
        }

        // Date of Birth validation
        const dateOfBirthParsed = new Date(dateOfBirth);
        if (!dateOfBirth) {
            errors.dateOfBirth = "Missing Date of Birth";
        } else if (
            !dateOfBirthParsed ||
            dateOfBirthParsed > new Date(Date.now())
        ) {
            errors.dateOfBirth = "Invalid Date of Birth";
        }

        // Email validation, ensuring emails match [characters]@[characters].[at least 2 characters]
        const validEmail =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*\.[a-zA-Z]{2,}$/;
        if (!email) {
            errors.email = "Missing Email";
        } else if (!validEmail.test(email)) {
            errors.email = "Invalid Email";
        }

        //Address validation, checks each portion of the address. Should be in the format Street, City, State Abr., Zip Code (5 or 9 digit)
        if (!address) {
            errors.address = "Missing Address";
        } else if (typeof address !== "string") {
            errors.address = "Invalid Address";
        } else {
            const addressList = address.split(",").map((add) => add.trim());
            if (addressList.length == 4) {
                const streetAddressRegex = /^\d+\s+[a-zA-Z.\-' ]+$/;
                if (streetAddressRegex.test(addressList[0])) {
                    const cityRegex = /^[a-zA-Z]+$/;
                    if (cityRegex.test(addressList[1])) {
                        const stateRegex = /^[A-Z]{2}$/;
                        if (stateRegex.test(addressList[2])) {
                            const zipRegex = /^\d{5}(-\d{4})?$/;
                            if (zipRegex.test(addressList[3])) {
                                address = addressList.join(", ");
                            } else {
                                errors.address =
                                    "Invalid Zip Code. Must Be a 5-digit or 9-digit zip code (e.g., 12345 or 12345-6789).";
                            }
                        } else {
                            errors.address =
                                "Invalid State Abbreviation. Must Be a 2-letter uppercase state abbreviation (e.g., IL, CA).";
                        }
                    } else {
                        errors.address =
                            "Invalid City. City must contain only alphabetic characters.";
                    }
                } else {
                    errors.address =
                        "Invalid Street Address. Must include a number followed by the street name (e.g., 123 Main St).";
                }
            } else {
                errors.address =
                    "Invalid Address. Must Be Comma Separated In The Following Format: Street Name and Number, City, State Abbreviation, Zip Code";
            }
        }

        // Phone validation, either 10 digit format, or 3 digits-3 digits-4 digits
        const validPhone = /^(?:\d{10}|\d{3}-\d{3}-\d{4})$/;
        if (!phone) {
            errors.phone = "Missing Phone";
        } else if (!validPhone.test(phone)) {
            errors.phone = "Invalid Phone";
        }

        // Insurance validation
        if (insurance === undefined) {
            errors.insurance = "Missing Insurance status";
        } else if (typeof insurance !== "boolean") {
            errors.insurance = "Invalid Insurance status";
        }

        //If there are any errors, then it will return those errors
        if (Object.keys(errors).length > 0) {
            if (id) {
                errors.formKey = "editPatient";
            } else {
                errors.formKey = "newPatient";
            }
            return {
                errors,
                values: {
                    firstName,
                    lastName,
                    dateOfBirth,
                    email,
                    phone,
                    address,
                    insurance,
                    id
                }
            };
        } else {
            //put the phone number into a consistent format without dashes
            const phoneFormat = /^\d{3}-\d{3}-\d{4}$/;
            let updatedPhone = phone;
            if (phoneFormat.test(phone)) {
                updatedPhone =
                    phone.substring(0, 3) +
                    phone.substring(4, 7) +
                    phone.substring(8);
            }
            //If there is an id, the patient already exists and just needs to be edited
            if (id) {
                await updatePatient(locals.db as D1Database, {
                    firstName,
                    lastName,
                    dateOfBirth: dateOfBirthParsed,
                    email,
                    phone: updatedPhone,
                    address,
                    insurance,
                    id
                });

                return {
                    success: `${firstName} ${lastName} successfully updated!`,
                    formKey: "editPatient"
                };
                //If there is no id, they dont exist and need to be inserted
            } else {
                await insertPatient(locals.db as D1Database, {
                    firstName,
                    lastName,
                    dateOfBirth: dateOfBirthParsed,
                    email,
                    phone: updatedPhone,
                    address,
                    insurance
                });

                return {
                    success: `${firstName} ${lastName} successfully added!`,
                    formKey: "createPatient"
                };
            }
        }
    }
};
