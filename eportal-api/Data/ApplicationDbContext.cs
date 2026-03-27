using Microsoft.EntityFrameworkCore;
using EPortalApi.Models;

namespace EPortalApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // ER Diagram Tables
        public DbSet<Citizen> Citizens { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<BillService> BillServices { get; set; }
        public DbSet<ServiceRequest> ServiceRequests { get; set; }

        // Admin auth
        public DbSet<AdminUser> AdminUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.UseSerialColumns(); // PostgreSQL compatibility

            // --- Citizen ---
            modelBuilder.Entity<Citizen>()
                .HasIndex(c => c.Email).IsUnique();

            // --- Employee ---
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email).IsUnique();

            // Employee M:1 Department (Works For)
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DNo)
                .OnDelete(DeleteBehavior.Restrict);

            // --- Complaint ---
            // Complaint M:1 Citizen (Reports)
            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.Citizen)
                .WithMany(ci => ci.Complaints)
                .HasForeignKey(c => c.IDNo)
                .OnDelete(DeleteBehavior.Cascade);

            // Complaint M:1 Employee (Assigned To)
            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.Employee)
                .WithMany(e => e.Complaints)
                .HasForeignKey(c => c.EID)
                .OnDelete(DeleteBehavior.SetNull);

            // Complaint M:1 Department (Assigned To)
            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.Department)
                .WithMany(d => d.Complaints)
                .HasForeignKey(c => c.DNo)
                .OnDelete(DeleteBehavior.SetNull);

            // --- Feedback ---
            // Feedback M:1 Citizen (Gives)
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Citizen)
                .WithMany(c => c.Feedbacks)
                .HasForeignKey(f => f.IDNo)
                .OnDelete(DeleteBehavior.Cascade);

            // Feedback M:1 Complaint (Refers To)
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Complaint)
                .WithMany(c => c.Feedbacks)
                .HasForeignKey(f => f.CID)
                .OnDelete(DeleteBehavior.SetNull);

            // --- Services ---
            // Services M:1 Department (Provides)
            modelBuilder.Entity<Service>()
                .HasOne(s => s.Department)
                .WithMany(d => d.Services)
                .HasForeignKey(s => s.DNo)
                .OnDelete(DeleteBehavior.SetNull);

            // --- Bill ---
            // Bill M:1 Citizen (Pays)
            modelBuilder.Entity<Bill>()
                .HasOne(b => b.Citizen)
                .WithMany(c => c.Bills)
                .HasForeignKey(b => b.IDNo)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            // --- BillService (Junction M:M Bill <-> Services) ---
            modelBuilder.Entity<BillService>()
                .HasOne(bs => bs.Bill)
                .WithMany(b => b.BillServices)
                .HasForeignKey(bs => bs.Bill_ID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BillService>()
                .HasOne(bs => bs.Service)
                .WithMany(s => s.BillServices)
                .HasForeignKey(bs => bs.SID)
                .OnDelete(DeleteBehavior.Restrict);

            // --- ServiceRequest ---
            modelBuilder.Entity<ServiceRequest>()
                .HasOne(sr => sr.Citizen)
                .WithMany(c => c.ServiceRequests)
                .HasForeignKey(sr => sr.IDNo)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ServiceRequest>()
                .HasOne(sr => sr.Service)
                .WithMany(s => s.ServiceRequests)
                .HasForeignKey(sr => sr.SID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ServiceRequest>()
                .HasOne(sr => sr.Bill)
                .WithOne(b => b.ServiceRequest)
                .HasForeignKey<ServiceRequest>(sr => sr.Bill_ID)
                .OnDelete(DeleteBehavior.SetNull);

            // --- AdminUser ---
            modelBuilder.Entity<AdminUser>()
                .HasIndex(a => a.Email).IsUnique();
        }
    }
}
