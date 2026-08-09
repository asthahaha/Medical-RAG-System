import java.util.ArrayList;
import java.util.Scanner;

class Patient {
    int id;
    String name;
    int age;
    String disease;

    Patient(int id, String name, int age, String disease) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.disease = disease;
    }

    void display() {
        System.out.println("Patient ID : " + id);
        System.out.println("Name       : " + name);
        System.out.println("Age        : " + age);
        System.out.println("Disease    : " + disease);
        System.out.println("---------------------------");
    }
}

public class HospitalManagementSystem {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<Patient> patients = new ArrayList<>();

        while (true) {
            System.out.println("\n===== Hospital Management System =====");
            System.out.println("1. Add Patient");
            System.out.println("2. View All Patients");
            System.out.println("3. Search Patient");
            System.out.println("4. Delete Patient");
            System.out.println("5. Exit");
            System.out.print("Enter your choice: ");

            int choice = sc.nextInt();

            switch (choice) {

                case 1:
                    System.out.print("Enter Patient ID: ");
                    int id = sc.nextInt();
                    sc.nextLine();

                    System.out.print("Enter Patient Name: ");
                    String name = sc.nextLine();

                    System.out.print("Enter Age: ");
                    int age = sc.nextInt();
                    sc.nextLine();

                    System.out.print("Enter Disease: ");
                    String disease = sc.nextLine();

                    patients.add(new Patient(id, name, age, disease));
                    System.out.println("Patient Added Successfully!");
                    break;

                case 2:
                    if (patients.isEmpty()) {
                        System.out.println("No Patients Found!");
                    } else {
                        System.out.println("\n--- Patient Records ---");
                        for (Patient p : patients) {
                            p.display();
                        }
                    }
                    break;

                case 3:
                    System.out.print("Enter Patient ID to Search: ");
                    int searchId = sc.nextInt();
                    boolean found = false;

                    for (Patient p : patients) {
                        if (p.id == searchId) {
                            p.display();
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        System.out.println("Patient Not Found!");
                    }
                    break;

                case 4:
                    System.out.print("Enter Patient ID to Delete: ");
                    int deleteId = sc.nextInt();

                    boolean removed = patients.removeIf(p -> p.id == deleteId);

                    if (removed) {
                        System.out.println("Patient Deleted Successfully!");
                    } else {
                        System.out.println("Patient Not Found!");
                    }
                    break;

                case 5:
                    System.out.println("Exiting...");
                    sc.close();
                    System.exit(0);

                default:
                    System.out.println("Invalid Choice!");
            }
        }
    }
}