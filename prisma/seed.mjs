import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Seeding EditBridge database with high-fidelity sample data...');

  // 1. Clean existing records in reverse dependency order
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.projectFile.deleteMany({});
  await prisma.revision.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.creatorProfile.deleteMany({});
  await prisma.editorProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared existing tables.');

  // 2. Create Users
  // Creator 1: Marcus Sterling
  const creatorUser = await prisma.user.create({
    data: {
      id: 'user-creator-1',
      email: 'marcus@sterlingcapital.yt',
      passwordHash: hashPassword('creator123'),
      fullName: 'Marcus Sterling',
      role: 'CREATOR',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      creatorProfile: {
        create: {
          channelName: 'Sterling Capital',
          platform: 'YouTube',
          subscriberTier: '100K_TO_500K',
          totalSpend: 4250.0,
          verifiedBadge: true,
        },
      },
    },
  });

  // Editor 1: Alex Rivera
  const editorUser1 = await prisma.user.create({
    data: {
      id: 'user-editor-1',
      email: 'alex@riverafilm.com',
      passwordHash: hashPassword('editor123'),
      fullName: 'Alex Rivera',
      role: 'EDITOR',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      editorProfile: {
        create: {
          bio: 'Specialized in transforming dense 30-minute talking head footage into compelling 12-minute documentary-style YouTube videos with 65%+ average view duration.',
          hourlyRate: 65.0,
          niches: 'Finance & Investing, Tech & AI, Documentaries, Video Essays',
          primarySoftware: 'DaVinci Resolve Studio & Premiere Pro',
          portfolioUrls: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          totalEarnings: 14850.0,
          rating: 4.96,
          verifiedBadge: true,
          disputeRate: 0.0,
          turnaroundDays: 3,
        },
      },
    },
  });

  // Editor 2: Maya Lin
  const editorUser2 = await prisma.user.create({
    data: {
      id: 'user-editor-2',
      email: 'maya@cutcraft.media',
      passwordHash: hashPassword('editor123'),
      fullName: 'Maya Lin',
      role: 'EDITOR',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      editorProfile: {
        create: {
          bio: 'Hyper-kinetic short-form editing optimized for retention hooks, aggressive pacing, and sound design. Over 80M cumulative views across TikTok and Reels.',
          hourlyRate: 50.0,
          niches: 'Shorts & TikTok, SaaS & Startups, Lifestyle, Podcasting Clips',
          primarySoftware: 'After Effects & Premiere Pro',
          portfolioUrls: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          totalEarnings: 8200.0,
          rating: 4.92,
          verifiedBadge: true,
          disputeRate: 0.0,
          turnaroundDays: 1,
        },
      },
    },
  });

  // Admin: Ops Elena
  const adminUser = await prisma.user.create({
    data: {
      id: 'user-admin-1',
      email: 'ops@editbridge.network',
      passwordHash: hashPassword('admin123'),
      fullName: 'Elena Drake (Root Ops)',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log('Created Users: Marcus (Creator), Alex (Editor), Maya (Editor), Elena (Admin)');

  // 3. Create Sample Project: The Great AI Bubble of 2026
  const project1 = await prisma.project.create({
    data: {
      id: 'proj-demo-1',
      title: 'The Great AI Bubble of 2026: Crash or Supercycle?',
      creatorId: creatorUser.id,
      editorId: editorUser1.id,
      briefDescription: 'A 14-minute deep dive comparing current AI datacenter capex to the 1999 fiber optic boom. Needs high-tempo visual storytelling, clean financial charts, kinetic callouts, and suspenseful B-roll pacing. Hook within the first 15 seconds is crucial.',
      aspectRatio: '16:9',
      targetDuration: '14 min',
      totalBudget: 600.0,
      status: 'REVIEW_REQUESTED',
      activeDraftUrl: null,
      watermarkActive: true,
      currentRound: 1,
      maxRounds: 3,
      milestones: {
        create: [
          {
            id: 'mile-1-upfront',
            title: 'Milestone 1: 30% Upfront Brief & Rough Cut',
            percentage: 30,
            amount: 180.0,
            status: 'RELEASED',
            releasedAt: new Date(Date.now() - 3 * 86400000),
          },
          {
            id: 'mile-2-master',
            title: 'Milestone 2: 70% Final Master & Delivery',
            percentage: 70,
            amount: 420.0,
            status: 'FUNDED',
          },
        ],
      },
      revisions: {
        create: [
          {
            id: 'rev-1',
            roundNumber: 1,
            authorId: creatorUser.id,
            timeSeconds: 14.5,
            category: 'PACING',
            comment: 'Hook pacing is slightly slow here. Can we punch in 12% on the talking head and add a subtle riser sound effect before the title card drops?',
            status: 'RESOLVED',
          },
          {
            id: 'rev-2',
            roundNumber: 1,
            authorId: creatorUser.id,
            timeSeconds: 42.0,
            category: 'TEXT_GRAPHICS',
            comment: 'Update the chart subtitle: Nvidia Q3 capex was $13.2B, not $12.8B. Also add a green trendline glow.',
            status: 'IN_PROGRESS',
          },
          {
            id: 'rev-3',
            roundNumber: 1,
            authorId: creatorUser.id,
            timeSeconds: 88.0,
            category: 'AUDIO',
            comment: 'Background synth music overtakes speech here. Dip audio track -4dB during this explanation of transformer efficiency.',
            status: 'PENDING',
          },
        ],
      },
      files: {
        create: [
          {
            id: 'file-1',
            name: 'A-Roll_Sterling_4K_ProRes.mov',
            fileType: 'RAW_FOOTAGE',
            sizeBytes: 12400000000,
            storageUrl: 'https://storage.editbridge.io/vault/proj-1/a-roll-sterling.mov',
            isMasterDelivery: false,
            isLocked: false,
            uploadedBy: creatorUser.id,
          },
        ],
      },
      messages: {
        create: [
          {
            id: 'msg-1',
            senderId: creatorUser.id,
            text: 'Hey Alex! Excited to collaborate on this AI bubble piece. Raw A-Roll and brand kit are in the vault.',
          },
          {
            id: 'msg-2',
            senderId: editorUser1.id,
            text: 'Got it Marcus! Rough assembly is ready with kinetic callouts. Draft v1 is uploaded with timecoded markers for your review.',
          },
        ],
      },
      payments: {
        create: [
          {
            id: 'pay-1',
            milestoneId: 'mile-1-upfront',
            payerId: creatorUser.id,
            amount: 180.0,
            platformFee: 9.0,
            status: 'SETTLED',
            transactionHash: '0x8f2d9c1b4e5a6f7d8e9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e',
          },
        ],
      },
      review: {
        create: {
          id: 'rev-init-1',
          reviewerId: creatorUser.id,
          revieweeId: editorUser1.id,
          rating: 5,
          comment: 'Alex delivered an extraordinary retention edit that exceeded all expectations. Fast turnaround and impeccable attention to detail.',
          tags: 'Superb Pacing, Clean Sound Design, Fast Delivery',
          verifiedOnChain: true,
        },
      },
    },
  });

  // 4. Create a second project in DRAFT status for Marcus
  await prisma.project.create({
    data: {
      id: 'proj-demo-2',
      title: 'How Quantum Computing Breaks Modern Encryption in 2027',
      creatorId: creatorUser.id,
      editorId: editorUser2.id,
      briefDescription: 'Explainer for tech enthusiasts on Shor algorithm and post-quantum lattice cryptography. Fast 8-minute explainer.',
      aspectRatio: '16:9',
      targetDuration: '8 min',
      totalBudget: 450.0,
      status: 'EDITING',
      watermarkActive: true,
      currentRound: 1,
      maxRounds: 2,
      milestones: {
        create: [
          {
            id: 'mile-2-1',
            title: 'Milestone 1: 30% Upfront',
            percentage: 30,
            amount: 135.0,
            status: 'RELEASED',
          },
          {
            id: 'mile-2-2',
            title: 'Milestone 2: 70% Final Master',
            percentage: 70,
            amount: 315.0,
            status: 'FUNDED',
          },
        ],
      },
    },
  });

  console.log('Seeded database successfully with 2 projects, 4 milestones, 3 revisions, 3 files, messages & payments.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
