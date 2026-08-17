import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

 
// INTERFACES
 
interface EmployeeTask {
  id: number;
  employee: string;
  domain: string;
  tasks: string[];
}

@Component({
  selector: 'app-taskedit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DrawerModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './taskedit.component.html',
  styleUrl: './taskedit.component.css',
})
export class TaskeditComponent {

   
  // COMPONENT STATE
   
  visible = false;                    // Drawer visibility
  searchText = '';                    // Search filter text
  selectedEmployee: EmployeeTask | null = null;  // Currently selected employee

   
  // TASK OPTIONS
   
  availableTasks: string[] = [
    'Dashboard',
    'Attendance',
    'Reports',
    'Login',
    'Machine Status',
    'User Management',
    'Analytics',
    'Settings',
    'Profile',
    'Employee Report',
    'Production',
    'Quality',
    'Inventory',
    'Approval',
    'Admin Panel',
  ];

  selectedTasks: string[] = [];       // Tasks selected for current employee

   
  // EMPLOYEE DATA
   
  employees: EmployeeTask[] = [
    {
      id: 1,
      employee: 'Srimack',
      domain: 'Voltas',
      tasks: ['Dashboard', 'Attendance', 'Reports'],
    },
    {
      id: 2,
      employee: 'Manoj Kumar',
      domain: 'SMS',
      tasks: ['Dashboard', 'Machine Status'],
    },
    {
      id: 3,
      employee: 'Manoj',
      domain: 'TVS',
      tasks: ['Reports', 'Login'],
    },
  ];

   
  // COMPUTED PROPERTIES
  get filteredEmployees(): EmployeeTask[] {
    if (!this.searchText.trim()) {
      return this.employees;
    }
    return this.employees.filter(
      (emp) =>
        emp.employee.toLowerCase().includes(this.searchText.toLowerCase()) ||
        emp.domain.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

   
  // EMPLOYEE SELECTION
  selectEmployee(emp: EmployeeTask): void {
    this.selectedEmployee = emp;
  }

   
  // DRAWER ACTIONS
  editEmployee(): void {
    if (!this.selectedEmployee) return;

    this.selectedTasks = [...this.selectedEmployee.tasks];
    this.visible = true;
  }

  deleteEmployee(): void {
    if (!this.selectedEmployee) return;

    const confirmDelete = confirm(`Delete ${this.selectedEmployee.employee}?`);
    if (!confirmDelete) return;

    this.employees = this.employees.filter(
      (emp) => emp.id !== this.selectedEmployee!.id,
    );
    this.selectedEmployee = null;
  }

   
  // TASK MANAGEMENT

  toggleTask(task: string): void {
    const index = this.selectedTasks.indexOf(task);
    if (index > -1) {
      this.selectedTasks.splice(index, 1);
    } else {
      this.selectedTasks.push(task);
    }
  }

  isSelected(task: string): boolean {
    return this.selectedTasks.includes(task);
  }

  /**
   * Saves the selected tasks to the employee
   * and closes the drawer
   */
  saveTasks(): void {
    if (!this.selectedEmployee) return;

    this.selectedEmployee.tasks = [...this.selectedTasks];
    this.visible = false;
  }

  /**
   * Removes the last task from selected employee
   * (Unused/legacy method)
   */
  removetask(): void {
    this.selectedEmployee?.tasks.pop();
  }
}
