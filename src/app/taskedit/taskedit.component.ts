import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { InventoryData, InventoryService } from "../services/inventory.service";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { LoadingService } from "../services/loading.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzButtonModule } from "ng-zorro-antd/button";

@Component({
  selector: "app-taskedit",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    NzDrawerModule,
    NgbNavModule,
    NzModalModule,
    NzButtonModule,
  ],
  templateUrl: "./taskedit.component.html",
  styleUrl: "./taskedit.component.css",
})
export class TaskeditComponent implements OnInit {
  saving: boolean = false;
  isVisible: boolean = false;
  isEditDrawer: boolean = false;
  delConfirmation: boolean = false;
  formSubmitted: boolean = false;
  ispopup: boolean = false;
  selectedPopUpData: InventoryData | null = null;

  cols = [
    { field: "name", header: "Name" },
    { field: "employee", header: "Employee" },
    { field: "role", header: "Role" },
    { field: "description", header: "Description" },
  ];
  inventoryList: InventoryData[] = [];
  selectedRows: InventoryData[] = [];
  selectedItem: InventoryData | null = null;

  drawerTitle: string = "Edit Inventory";
  currentInventory: Partial<InventoryData> = {
    name: "",
    description: "",
    employee: "",
    role: "",
  };

  constructor(
    private inventoryService: InventoryService,
    private loadingService: LoadingService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {}

  ngOnInit() {
    this.getInventory();
  }
  tabClick(selectTab: any) {
    if (selectTab == 1) {
      this.getInventory();
    }
    if (selectTab == 2) {
      this.getInventory();
    }
  }
  async getInventory(): Promise<void> {
    this.loadingService.show();
    const clientId = localStorage.getItem("clientId");
    console.log("This is the currentId :", clientId);
    try {
      const data: any = await this.inventoryService.getInventory(clientId);
      this.inventoryList = data;
      this.loadingService.hide();
    } catch (err) {
      console.log(err);
      this.loadingService.hide();
    }
  }
  delconfirmationfun() {
    this.delConfirmation = false;
  }

  openDrawer() {
    this.isEditDrawer = false;
    this.drawerTitle = "Add Inventory";
    this.formSubmitted = false;
    this.currentInventory = {
      name: "",
      employee: "",
      role: "",
      description: "",
    };
    this.isVisible = true;
  }

  openEditDrawer(item: InventoryData) {
    this.isEditDrawer = true;
    this.drawerTitle = "Edit Inventory";
    this.formSubmitted = false;
    this.currentInventory = { ...item };
    this.isVisible = true;
  }

  closeDrawer() {
    this.isVisible = false;
    this.formSubmitted = false;
    this.currentInventory = {
      name: "",
      description: "",
    };
  }
  saveInventory(): void {
    this.formSubmitted = true;
    if (
      !this.currentInventory.name?.trim() ||
      !this.currentInventory.employee?.trim() ||
      !this.currentInventory.role?.trim() ||
      !this.currentInventory.description?.trim()
    ) {
      return;
    }
    this.saving = true;

    if (this.isEditDrawer && this.currentInventory.id) {
      this.loadingService.show();
      this.inventoryService
        .updateInventory(this.currentInventory.id, this.currentInventory)
        .subscribe({
          next: (updatedItem) => {
            const index = this.inventoryList.findIndex(
              (item) => item.id === updatedItem.id,
            );
            if (index !== -1) {
              this.inventoryList[index] = updatedItem;
              this.inventoryList = [...this.inventoryList];
            }
            this.saving = false;
            this.closeDrawer();
            this.loadingService.hide();
            this.message.success("Updated Successfully", { nzDuration: 5000 });
          },
          error: (err) => {
            this.message.success("Failed to update inventory", {
              nzDuration: 5000,
            });
            console.error("Failed to update data", err);
            this.saving = false;
          },
        });
    } else {
      const nextId = this.getNextId();
      const currentClientId = localStorage.getItem("clientId")
        ? Number(localStorage.getItem("clientId"))
        : 101;
      const payload: Partial<InventoryData> = {
        ...this.currentInventory,
        id: nextId,
        clientId: currentClientId,
      };
      this.inventoryService.addInventory(payload).subscribe({
        next: (newItem) => {
          this.inventoryList = [...this.inventoryList, newItem];
          this.saving = false;
          this.closeDrawer();
          this.loadingService.show();
          this.message.success("Added Successfully", { nzDuration: 5000 });
        },
        error: (err) => {
          this.message.success("Failed to add inventory", { nzDuration: 5000 });
          console.error("Failed to add data", err);
          this.saving = false;
        },
      });
      this.loadingService.hide();
    }
  }

  deleteSelected(): void {
    if (this.selectedRows.length === 0) return;
    this.delConfirmation = true;
  }

  confirmDelete(): void {
    this.delConfirmation = false;
    for (const row of this.selectedRows) {
      this.inventoryService.deleteInventory(row.id).subscribe({
        next: () => {
          this.inventoryList = this.inventoryList.filter(
            (dr) => dr.id !== row.id,
          );
          this.loadingService.show();
        },
        error: (err) => console.error("Failed to delete", row.name, err),
      });
      this.loadingService.hide();
    }
    this.selectedRows = [];
  }

  getNextId(): string {
    return crypto.randomUUID();
  }
  view(data: InventoryData): void {
    this.selectedPopUpData = data;
    this.ispopup = true;
  }
  closeView(): void {
    this.selectedPopUpData = null;
    this.ispopup = false;
  }
}
