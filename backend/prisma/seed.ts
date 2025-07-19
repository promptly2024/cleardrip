// To run this seed file run command : npx ts-node prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');

    // Clear existing data
    await prisma.whatsAppLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.tDSLog.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.service.deleteMany();
    await prisma.oTPSession.deleteMany();
    await prisma.user.deleteMany();
    await prisma.address.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.product.deleteMany();

    // Hash passwords
    const userPassword = await bcrypt.hash('12345678', 10);
    const adminPassword = await bcrypt.hash('123456', 10);

    // Create addresses
    const addresses = await Promise.all([
        prisma.address.create({
            data: {
                street: '123 Main Street, Apt 4B',
                city: 'Mumbai',
                state: 'Maharashtra',
                postalCode: '400001',
                country: 'India'
            }
        }),
        prisma.address.create({
            data: {
                street: '456 Park Avenue',
                city: 'Delhi',
                state: 'Delhi',
                postalCode: '110001',
                country: 'India'
            }
        }),
        prisma.address.create({
            data: {
                street: '789 Gandhi Road',
                city: 'Bangalore',
                state: 'Karnataka',
                postalCode: '560001',
                country: 'India'
            }
        }),
        prisma.address.create({
            data: {
                street: '321 Nehru Street',
                city: 'Chennai',
                state: 'Tamil Nadu',
                postalCode: '600001',
                country: 'India'
            }
        })
    ]);

    // Create users
    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Rohit Kuyada',
                email: 'rohitkuyada@gmail.com',
                phone: '+91-9876543210',
                password: userPassword,
                loyaltyStatus: 'GOLD',
                addressId: addresses[0].id
            }
        }),
        prisma.user.create({
            data: {
                name: 'Priya Sharma',
                email: 'priya.sharma@gmail.com',
                phone: '+91-9876543211',
                password: userPassword,
                loyaltyStatus: 'SILVER',
                addressId: addresses[1].id
            }
        }),
        prisma.user.create({
            data: {
                name: 'Amit Patel',
                email: 'amit.patel@gmail.com',
                phone: '+91-9876543212',
                password: userPassword,
                loyaltyStatus: 'PLATINUM',
                addressId: addresses[2].id
            }
        }),
        prisma.user.create({
            data: {
                name: 'Sneha Reddy',
                email: 'sneha.reddy@gmail.com',
                phone: '+91-9876543213',
                password: userPassword,
                loyaltyStatus: 'BRONZE',
                addressId: addresses[3].id
            }
        }),
        prisma.user.create({
            data: {
                name: 'Rajesh Kumar',
                email: 'rajesh.kumar@gmail.com',
                phone: '+91-9876543214',
                password: userPassword,
                loyaltyStatus: 'GOLD'
            }
        })
    ]);

    // Create admins
    const admins = await Promise.all([
        prisma.admin.create({
            data: {
                name: 'Super Admin',
                email: 'superadmin@gmail.com',
                password: adminPassword,
                role: 'SUPERADMIN'
            }
        }),
        prisma.admin.create({
            data: {
                name: 'Staff Admin',
                email: 'staffadmin@gmail.com',
                password: adminPassword,
                role: 'STAFF'
            }
        })
    ]);

    // Create products
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Water Purifier Filter',
                price: 1200.00,
                description: 'High-quality replacement filter for water purifiers',
                inventory: 50
            }
        }),
        prisma.product.create({
            data: {
                name: 'UV Lamp',
                price: 800.00,
                description: 'UV sterilization lamp for water purification',
                inventory: 30
            }
        }),
        prisma.product.create({
            data: {
                name: 'Membrane Cartridge',
                price: 2500.00,
                description: 'RO membrane cartridge for reverse osmosis systems',
                inventory: 25
            }
        }),
        prisma.product.create({
            data: {
                name: 'Pre-filter Set',
                price: 600.00,
                description: 'Set of 3 pre-filters for water purification system',
                inventory: 40
            }
        }),
        prisma.product.create({
            data: {
                name: 'Storage Tank',
                price: 3500.00,
                description: '10L storage tank for purified water',
                inventory: 15
            }
        })
    ]);

    // Create services
    const services = await Promise.all([
        prisma.service.create({
            data: {
                userId: users[0].id,
                type: 'AMC',
                status: 'COMPLETED',
                scheduledDate: new Date('2024-12-01T10:00:00'),
                beforeImageUrl: 'https://cloudinary.com/sample-before-1.jpg',
                afterImageUrl: 'https://cloudinary.com/sample-after-1.jpg'
            }
        }),
        prisma.service.create({
            data: {
                userId: users[1].id,
                type: 'URGENT',
                status: 'IN_PROGRESS',
                scheduledDate: new Date('2024-12-15T14:30:00'),
                beforeImageUrl: 'https://cloudinary.com/sample-before-2.jpg'
            }
        }),
        prisma.service.create({
            data: {
                userId: users[2].id,
                type: 'AMC',
                status: 'SCHEDULED',
                scheduledDate: new Date('2024-12-20T09:00:00')
            }
        }),
        prisma.service.create({
            data: {
                userId: users[0].id,
                type: 'URGENT',
                status: 'PENDING',
                scheduledDate: new Date('2024-12-18T16:00:00')
            }
        }),
        prisma.service.create({
            data: {
                userId: users[3].id,
                type: 'AMC',
                status: 'CANCELLED',
                scheduledDate: new Date('2024-12-10T11:00:00')
            }
        })
    ]);

    // Create subscriptions
    const subscriptions = await Promise.all([
        prisma.subscription.create({
            data: {
                userId: users[0].id,
                planType: 'Annual',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                loyaltyBadge: 'Gold Member'
            }
        }),
        prisma.subscription.create({
            data: {
                userId: users[1].id,
                planType: 'Monthly',
                startDate: new Date('2024-12-01'),
                endDate: new Date('2025-01-01'),
                loyaltyBadge: 'Silver Member'
            }
        }),
        prisma.subscription.create({
            data: {
                userId: users[2].id,
                planType: 'Annual',
                startDate: new Date('2024-06-01'),
                endDate: new Date('2025-05-31'),
                loyaltyBadge: 'Platinum Member'
            }
        }),
        prisma.subscription.create({
            data: {
                userId: users[4].id,
                planType: 'Quarterly',
                startDate: new Date('2024-10-01'),
                endDate: new Date('2025-01-01'),
                loyaltyBadge: 'Gold Member'
            }
        })
    ]);

    // Create TDS logs
    const tdsLogs = await Promise.all([
        prisma.tDSLog.create({
            data: {
                userId: users[0].id,
                tdsValue: 25,
                timestamp: new Date('2024-12-01T08:00:00')
            }
        }),
        prisma.tDSLog.create({
            data: {
                userId: users[0].id,
                tdsValue: 30,
                timestamp: new Date('2024-12-02T08:00:00')
            }
        }),
        prisma.tDSLog.create({
            data: {
                userId: users[1].id,
                tdsValue: 45,
                timestamp: new Date('2024-12-01T09:00:00')
            }
        }),
        prisma.tDSLog.create({
            data: {
                userId: users[2].id,
                tdsValue: 15,
                timestamp: new Date('2024-12-01T10:00:00')
            }
        }),
        prisma.tDSLog.create({
            data: {
                userId: users[3].id,
                tdsValue: 60,
                timestamp: new Date('2024-12-01T11:00:00')
            }
        })
    ]);

    // Create notifications
    const notifications = await Promise.all([
        prisma.notification.create({
            data: {
                userId: users[0].id,
                type: 'FCM',
                message: 'Your AMC service is completed. Thank you for choosing our services!',
                status: 'SENT',
                sentAt: new Date('2024-12-01T10:30:00')
            }
        }),
        prisma.notification.create({
            data: {
                userId: users[1].id,
                type: 'WHATSAPP',
                message: 'Your urgent service request is now in progress. Our technician will reach you shortly.',
                status: 'SENT',
                sentAt: new Date('2024-12-15T14:45:00')
            }
        }),
        prisma.notification.create({
            data: {
                userId: users[2].id,
                type: 'EMAIL',
                message: 'Your AMC service is scheduled for Dec 20, 2024 at 9:00 AM. Please be available.',
                status: 'PENDING'
            }
        }),
        prisma.notification.create({
            data: {
                userId: users[0].id,
                type: 'FCM',
                message: 'Your TDS level is 30 ppm. Your water quality is excellent!',
                status: 'SENT',
                sentAt: new Date('2024-12-02T08:15:00')
            }
        }),
        prisma.notification.create({
            data: {
                userId: users[3].id,
                type: 'WHATSAPP',
                message: 'Your service request has been cancelled. Please contact support for more details.',
                status: 'FAILED'
            }
        })
    ]);

    // Create WhatsApp logs
    const whatsappLogs = await Promise.all([
        prisma.whatsAppLog.create({
            data: {
                userId: users[0].id,
                messageType: 'TEXT',
                content: 'Hello! Your AMC service is scheduled for tomorrow at 10 AM.',
                timestamp: new Date('2024-11-30T18:00:00')
            }
        }),
        prisma.whatsAppLog.create({
            data: {
                userId: users[1].id,
                messageType: 'BUTTON',
                content: 'Would you like to reschedule your service? Click Yes or No.',
                timestamp: new Date('2024-12-14T10:00:00')
            }
        }),
        prisma.whatsAppLog.create({
            data: {
                userId: users[2].id,
                messageType: 'IMAGE',
                content: 'Here is the before image of your water purifier service.',
                timestamp: new Date('2024-12-01T09:30:00')
            }
        }),
        prisma.whatsAppLog.create({
            data: {
                userId: users[0].id,
                messageType: 'TEXT',
                content: 'Thank you for your feedback! We are glad to serve you.',
                timestamp: new Date('2024-12-01T11:00:00')
            }
        }),
        prisma.whatsAppLog.create({
            data: {
                userId: users[3].id,
                messageType: 'AUDIO',
                content: 'Voice message about service cancellation details.',
                timestamp: new Date('2024-12-10T15:00:00')
            }
        })
    ]);

    // Create OTP sessions
    const otpSessions = await Promise.all([
        prisma.oTPSession.create({
            data: {
                userId: users[0].id,
                otpCode: '123456',
                channel: 'EMAIL',
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
                verified: true
            }
        }),
        prisma.oTPSession.create({
            data: {
                userId: users[1].id,
                otpCode: '789012',
                channel: 'PHONE',
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
                verified: false
            }
        }),
        prisma.oTPSession.create({
            data: {
                userId: users[2].id,
                otpCode: '345678',
                channel: 'EMAIL',
                expiresAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago (expired)
                verified: false
            }
        }),
        prisma.oTPSession.create({
            data: {
                userId: users[3].id,
                otpCode: '901234',
                channel: 'PHONE',
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
                verified: true
            }
        })
    ]);

    console.log('Database seeding completed successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${admins.length} admins`);
    console.log(`Created ${products.length} products`);
    console.log(`Created ${services.length} services`);
    console.log(`Created ${subscriptions.length} subscriptions`);
    console.log(`Created ${tdsLogs.length} TDS logs`);
    console.log(`Created ${notifications.length} notifications`);
    console.log(`Created ${whatsappLogs.length} WhatsApp logs`);
    console.log(`Created ${otpSessions.length} OTP sessions`);
    console.log(`Created ${addresses.length} addresses`);
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });