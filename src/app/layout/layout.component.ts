import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";

import { BarchartdataservicesService } from "../services/barchartdataservices.service";
import { LoadingService } from "../services/loading.service";
import { FormsModule } from "@angular/forms";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzMenuModule } from "ng-zorro-antd/menu";

import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzButtonModule } from "ng-zorro-antd/button";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    NzSelectModule,
    NzDropDownModule,
    NzMenuModule,
    NzModalModule,
    NzButtonModule,
  ],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent implements OnInit {
  selectedArea: string = "Voltas";
  currentUser: any;
  sidebar = false;
  profilePicUrl = "/Images/profile.png";
  isLogout = false;
  constructor(
    public router: Router,
    public barchartDataService: BarchartdataservicesService,
    private loadingService: LoadingService,
  ) {}
  selectClient: number = 101;
  usersList = [
    { id: 101, name: "Voltas" },
    { id: 102, name: "Area1" },
    { id: 103, name: "Area2" },
  ];
  ngOnInit(): void {
    const savedClientId = localStorage.getItem("clientId");
    this.selectClient = savedClientId
      ? Number(savedClientId)
      : this.usersList[0].id;
    localStorage.setItem("clientId", this.selectClient.toString());

    const client = this.usersList.find((cli) => cli.id == this.selectClient);
    if (client) {
      this.barchartDataService.selectedArea = client.name;
    }

    const user = localStorage.getItem("currentUser");
    if (user) {
      this.currentUser = JSON.parse(user);
      if (!this.barchartDataService.selectedDomain) {
        if (this.currentUser.role === "ADMIN") {
          this.barchartDataService.selectedDomain = "All";
        } else {
          this.barchartDataService.selectedDomain = this.currentUser.domain;
        }
      }
    }
  }

  profile() {
    this.router.navigate(["/profile"]);
  }

  confirmLogout() {
    this.isLogout = true;
  }
  logout() {
    this.isLogout = false;
    this.loadingService.show();
    localStorage.removeItem("currentUser");
    this.router.navigate(["/loginform"]);
  }

  closePopUp() {
    this.isLogout = false;
  }

  expand() {
    this.sidebar = !this.sidebar;
  }
  showdomainreport(domainname: string): boolean {
    if (!this.currentUser) {
      return false;
    }
    if (this.currentUser.role === "ADMIN") {
      return true;
    }
    return (
      this.currentUser.domain.toLowerCase() === domainname.toLocaleLowerCase()
    );
  }
  openReport(domain: string) {
    this.loadingService.show();
    this.barchartDataService.selectedDomain = domain;
    console.log(
      "Selected Domain in Layout:",
      this.barchartDataService.selectedDomain,
    );
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/dashboard"]);
    });
  }
  taskeditOpen() {
    this.loadingService.show();
    this.router.navigate(["/taskedit"]);
  }
  placeChange(event: Event) {
    this.barchartDataService.selectedArea = this.selectedArea;
  }
  Home(clientId: any = 101): void {
    this.selectClient = Number(clientId);
    localStorage.setItem("clientId", clientId.toString());
    const client = this.usersList.find((cli) => cli.id == clientId);
    if (client) {
      localStorage.setItem("clientDetails", JSON.stringify(client));
    }
    this.loadingService.show();
    if (this.currentUser.role === "ADMIN") {
      this.barchartDataService.selectedDomain = "All";
    } else {
      this.barchartDataService.selectedDomain = this.currentUser.domain;
    }
    this.router
      .navigateByUrl("empty", { skipLocationChange: true })
      .then(() => {
        if (client) {
          this.barchartDataService.selectedArea = client.name;
        } else {
          this.barchartDataService.selectedArea = "Voltas";
        }
        this.router.navigate(["/dashboard"]);
      });
  }

  changeClient(clientId: number): void {
    localStorage.setItem("clientId", clientId.toString());
    const selectedCli = this.usersList.find((clid) => clid.id == clientId);
    if (selectedCli) {
      localStorage.setItem("clientDetails", JSON.stringify(selectedCli));
      console.log("this is the selectedCli", selectedCli);
    }
    const currentPath = this.router.url;
    setTimeout(() => {
      this.router
        .navigateByUrl("empty", { skipLocationChange: true })
        .then(() => {
          if (selectedCli) {
            this.barchartDataService.selectedArea = selectedCli.name;
          }
          this.router.navigate([currentPath]);
        });
    }, 1);
  }
  goToEmpty(path: string) {
    setTimeout(() => {
      this.router
        .navigateByUrl("empty", { skipLocationChange: true })
        .then(() => {
          this.router.navigate([path]);
        });
    }, 1);
  }
  onHrefClick(event: Event): void {
    event.preventDefault();
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 600);
  }
}
