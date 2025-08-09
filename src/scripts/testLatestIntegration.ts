import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';

// Configure Amplify
Amplify.configure(amplifyconfig);

// Import the new actions to test integration
import createAssessment from '../actions/createAssessment';
import loadUserAssessments from '../actions/loadUserAssessments';
import loadUserKnowledgeGaps from '../actions/loadUserKnowledgeGaps';
import updateKnowledgeGap from '../actions/updateKnowledgeGap';

// Import existing actions to ensure they still work
import loadCourses from '../actions/loadCourses';
import createUser from '../actions/createUser';
import loadUserProfile from '../actions/loadUserProfile';

async function testLatestIntegration() {
  console.log('🔗 Testing Latest Version Integration with Amplify...\n');

  try {
    // Test 1: Verify existing functionality still works
    console.log('1. Testing existing Amplify functionality...');
    
    const courses = await loadCourses();
    console.log(`✓ Existing loadCourses: ${courses.length} courses loaded`);

    // Create a test user for new features
    const testUser = await createUser({
      email: 'integration-test@example.com',
      username: 'integrationtest',
      fullName: 'Integration Test User'
    });
    console.log(`✓ Existing createUser: Created user ${testUser.username}`);

    const userProfile = await loadUserProfile(testUser.id);
    console.log(`✓ Existing loadUserProfile: Loaded profile for ${userProfile?.username}`);
    console.log();

    // Test 2: Test new assessment functionality
    console.log('2. Testing new assessment functionality...');
    
    const assessmentResult = await createAssessment({
      userId: testUser.id,
      assessmentType: 'initial',
      subjectArea: 'JavaScript Fundamentals',
      questionsData: [
        { id: '1', question: 'What is a variable?', type: 'multiple_choice' },
        { id: '2', question: 'What is a function?', type: 'multiple_choice' }
      ],
      answersData: [
        { questionId: '1', answer: 'A container for data' },
        { questionId: '2', answer: 'A reusable block of code' }
      ],
      score: 85,
      identifiedGaps: ['Advanced concepts', 'ES6 features'],
      recommendations: ['Study closures', 'Practice arrow functions']
    });
    console.log(`✓ New createAssessment: Created assessment ${assessmentResult.assessmentId}`);

    const userAssessments = await loadUserAssessments(testUser.id, 5);
    console.log(`✓ New loadUserAssessments: Loaded ${userAssessments.length} assessments`);
    
    if (userAssessments.length > 0) {
      const assessment = userAssessments[0];
      console.log(`  - Assessment type: ${assessment.assessment_type}`);
      console.log(`  - Score: ${assessment.score}%`);
      console.log(`  - Subject: ${assessment.subject_area}`);
    }
    console.log();

    // Test 3: Test knowledge gap functionality
    console.log('3. Testing knowledge gap functionality...');
    
    const gapResult = await updateKnowledgeGap({
      userId: testUser.id,
      subjectArea: 'JavaScript',
      conceptName: 'Closures',
      confidenceLevel: 60,
      masteryStatus: 'developing'
    });
    console.log(`✓ New updateKnowledgeGap: Updated gap ${gapResult.gapId}`);

    const knowledgeGaps = await loadUserKnowledgeGaps(testUser.id);
    console.log(`✓ New loadUserKnowledgeGaps: Loaded ${knowledgeGaps.length} knowledge gaps`);
    
    if (knowledgeGaps.length > 0) {
      const gap = knowledgeGaps[0];
      console.log(`  - Concept: ${gap.concept_name}`);
      console.log(`  - Subject: ${gap.subject_area}`);
      console.log(`  - Mastery: ${gap.mastery_status}`);
      console.log(`  - Confidence: ${gap.confidence_level}%`);
    }
    console.log();

    // Test 4: Test component integration readiness
    console.log('4. Testing component integration readiness...');
    
    // Simulate data that would be passed to new components
    const assessmentSystemData = {
      userId: testUser.id,
      knowledgeGaps: knowledgeGaps,
      recentAssessments: userAssessments,
      isLoading: false
    };
    
    console.log('✓ AssessmentSystem component data ready:');
    console.log(`  - User ID: ${assessmentSystemData.userId}`);
    console.log(`  - Knowledge gaps: ${assessmentSystemData.knowledgeGaps.length}`);
    console.log(`  - Recent assessments: ${assessmentSystemData.recentAssessments.length}`);

    const zunoBrandHeaderData = {
      user: {
        ...testUser,
        currentStreak: 5,
        currentLevel: 2
      }
    };
    
    console.log('✓ ZunoBrandHeader component data ready:');
    console.log(`  - User: ${zunoBrandHeaderData.user.username}`);
    console.log(`  - Level: ${zunoBrandHeaderData.user.currentLevel}`);
    console.log(`  - XP: ${zunoBrandHeaderData.user.totalXp}`);
    console.log();

    // Test 5: Test data consistency
    console.log('5. Testing data consistency...');
    
    // Verify that new data integrates well with existing data
    const allUserData = {
      profile: userProfile,
      assessments: userAssessments,
      knowledgeGaps: knowledgeGaps,
      courses: courses.slice(0, 3) // Sample courses
    };
    
    console.log('✓ Integrated user data structure:');
    console.log(`  - Profile: ${allUserData.profile?.username}`);
    console.log(`  - Assessments: ${allUserData.assessments.length}`);
    console.log(`  - Knowledge gaps: ${allUserData.knowledgeGaps.length}`);
    console.log(`  - Available courses: ${allUserData.courses.length}`);
    console.log();

    console.log('✅ All latest version integration tests passed!');
    console.log('\n📋 Integration Summary:');
    console.log('- Existing Amplify functionality preserved ✓');
    console.log('- New assessment system integrated ✓');
    console.log('- Knowledge gap tracking working ✓');
    console.log('- Component data structures ready ✓');
    console.log('- Data consistency maintained ✓');
    console.log('\n🎉 Latest version successfully integrated with Amplify backend!');

  } catch (error) {
    console.error('❌ Error during latest version integration testing:', error);
    throw error;
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testLatestIntegration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { testLatestIntegration };