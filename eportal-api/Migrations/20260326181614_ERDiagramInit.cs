using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EPortalApi.Migrations
{
    /// <inheritdoc />
    public partial class ERDiagramInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminUser",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminUser", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Citizen",
                columns: table => new
                {
                    IDNo = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: true),
                    Bday = table.Column<string>(type: "text", nullable: true),
                    Phno = table.Column<string>(type: "text", nullable: true),
                    House_no = table.Column<string>(type: "text", nullable: true),
                    Street_no_name = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Citizen", x => x.IDNo);
                });

            migrationBuilder.CreateTable(
                name: "Department",
                columns: table => new
                {
                    DNo = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.DNo);
                });

            migrationBuilder.CreateTable(
                name: "Bill",
                columns: table => new
                {
                    Bill_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    P_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Total_amt = table.Column<decimal>(type: "numeric", nullable: false),
                    PaymentMethod = table.Column<string>(type: "text", nullable: true),
                    IsPaid = table.Column<bool>(type: "boolean", nullable: false),
                    IDNo = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bill", x => x.Bill_ID);
                    table.ForeignKey(
                        name: "FK_Bill_Citizen_IDNo",
                        column: x => x.IDNo,
                        principalTable: "Citizen",
                        principalColumn: "IDNo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    EID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    EName = table.Column<string>(type: "text", nullable: false),
                    EAdd = table.Column<string>(type: "text", nullable: true),
                    Phno = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    DNo = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.EID);
                    table.ForeignKey(
                        name: "FK_Employee_Department_DNo",
                        column: x => x.DNo,
                        principalTable: "Department",
                        principalColumn: "DNo",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    SID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    SName = table.Column<string>(type: "text", nullable: false),
                    Rate = table.Column<decimal>(type: "numeric", nullable: false),
                    DNo = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.SID);
                    table.ForeignKey(
                        name: "FK_Services_Department_DNo",
                        column: x => x.DNo,
                        principalTable: "Department",
                        principalColumn: "DNo",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Complaint",
                columns: table => new
                {
                    CID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    C_status = table.Column<string>(type: "text", nullable: false),
                    C_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    ProofImageUrl = table.Column<string>(type: "text", nullable: true),
                    IDNo = table.Column<int>(type: "integer", nullable: false),
                    EID = table.Column<int>(type: "integer", nullable: true),
                    DNo = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Complaint", x => x.CID);
                    table.ForeignKey(
                        name: "FK_Complaint_Citizen_IDNo",
                        column: x => x.IDNo,
                        principalTable: "Citizen",
                        principalColumn: "IDNo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Complaint_Department_DNo",
                        column: x => x.DNo,
                        principalTable: "Department",
                        principalColumn: "DNo",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Complaint_Employee_EID",
                        column: x => x.EID,
                        principalTable: "Employee",
                        principalColumn: "EID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "BillServices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Bill_ID = table.Column<int>(type: "integer", nullable: false),
                    SID = table.Column<int>(type: "integer", nullable: false),
                    Rate = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillServices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BillServices_Bill_Bill_ID",
                        column: x => x.Bill_ID,
                        principalTable: "Bill",
                        principalColumn: "Bill_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BillServices_Services_SID",
                        column: x => x.SID,
                        principalTable: "Services",
                        principalColumn: "SID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Feedback",
                columns: table => new
                {
                    FID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Subject = table.Column<string>(type: "text", nullable: true),
                    Message = table.Column<string>(type: "text", nullable: true),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    WorkDoneDescription = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IDNo = table.Column<int>(type: "integer", nullable: true),
                    CID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedback", x => x.FID);
                    table.ForeignKey(
                        name: "FK_Feedback_Citizen_IDNo",
                        column: x => x.IDNo,
                        principalTable: "Citizen",
                        principalColumn: "IDNo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Feedback_Complaint_CID",
                        column: x => x.CID,
                        principalTable: "Complaint",
                        principalColumn: "CID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "AdminUser",
                columns: new[] { "Id", "Email", "Name", "PasswordHash", "Role" },
                values: new object[] { 1, "admin@emunicipal.com", "Super Admin", "7viNHfbGFmwOFsGxYNFBGqnRR/sPDnPxpMzrBLmO3G0=", "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_AdminUser_Email",
                table: "AdminUser",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bill_IDNo",
                table: "Bill",
                column: "IDNo");

            migrationBuilder.CreateIndex(
                name: "IX_BillServices_Bill_ID",
                table: "BillServices",
                column: "Bill_ID");

            migrationBuilder.CreateIndex(
                name: "IX_BillServices_SID",
                table: "BillServices",
                column: "SID");

            migrationBuilder.CreateIndex(
                name: "IX_Citizen_Email",
                table: "Citizen",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Complaint_DNo",
                table: "Complaint",
                column: "DNo");

            migrationBuilder.CreateIndex(
                name: "IX_Complaint_EID",
                table: "Complaint",
                column: "EID");

            migrationBuilder.CreateIndex(
                name: "IX_Complaint_IDNo",
                table: "Complaint",
                column: "IDNo");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_DNo",
                table: "Employee",
                column: "DNo");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_Email",
                table: "Employee",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_CID",
                table: "Feedback",
                column: "CID");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_IDNo",
                table: "Feedback",
                column: "IDNo");

            migrationBuilder.CreateIndex(
                name: "IX_Services_DNo",
                table: "Services",
                column: "DNo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminUser");

            migrationBuilder.DropTable(
                name: "BillServices");

            migrationBuilder.DropTable(
                name: "Feedback");

            migrationBuilder.DropTable(
                name: "Bill");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Complaint");

            migrationBuilder.DropTable(
                name: "Citizen");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Department");
        }
    }
}
