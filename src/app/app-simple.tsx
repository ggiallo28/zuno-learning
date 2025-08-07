import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoachProvider, useCoach } from '@/contexts/CoachContext';
import { CoachSelection } from '@/components/CoachSelection';
import { BookOpen, User as UserIcon, Trophy, Settings, Palette } from 'lucide-react';
import type { CoachType } from '@/types';

function AppContent() {
    const [activeTab, setActiveTab] = useState('courses');
    const [showCoachSelection, setShowCoachSelection] = useState(false);
    const { currentCoach, setCoach } = useCoach();

    const handleCoachChange = async (coachType: CoachType) => {
        setCoach(coachType);
        setShowCoachSelection(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Zuno://</h1>
                            <span className="ml-2 text-sm text-gray-500">Personalized Learning Platform</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCoachSelection(true)}
                                className="flex items-center gap-2"
                            >
                                <Palette className="h-4 w-4" />
                                Coach: {currentCoach}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="courses" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Courses
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="achievements" className="flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            Achievements
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="courses" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sample Course 1</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">This is a sample course to test the UI.</p>
                                    <Button className="mt-4 w-full">Enroll</Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sample Course 2</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Another sample course for testing.</p>
                                    <Button className="mt-4 w-full">Enroll</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="profile" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">Profile information will be displayed here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="achievements" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Achievements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">Your achievements will be shown here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">Application settings will be available here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Coach Selection Modal */}
            {showCoachSelection && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Choose Your Coach</h2>
                            <Button
                                variant="outline"
                                onClick={() => setShowCoachSelection(false)}
                            >
                                Close
                            </Button>
                        </div>
                        <CoachSelection
                            onCoachSelect={handleCoachChange}
                            selectedCoach={currentCoach}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <CoachProvider>
            <AppContent />
        </CoachProvider>
    );
}

export default App;